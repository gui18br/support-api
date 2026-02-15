import { Sentiment } from '../domain/entities/sentiment.entity';
import { SentimentLabel } from '../domain/enums/sentiment-label.enum';
import { SentimentAnalyzer } from '../domain/repositories/sentiment.repository';
import { SentimentResult } from '../domain/value-objects/sentiment-result';

type LexiconEntry = {
  weight: number;
  terms: string[];
};

export class SimpleSentimentAnalyzer implements SentimentAnalyzer {
  // ==============================
  // Configurações ajustáveis
  // ==============================

  private NEGATION_WINDOW = 3;
  private POSITION_WEIGHT_FACTOR = 0.15;
  private INTENSIFIER_MULTIPLIER = 1.8;
  private DIMINISHER_MULTIPLIER = 0.6;
  private EMBEDDING_DIMENSION = 256;

  // ==============================
  // Stopwords
  // ==============================

  private stopwords = new Set([
    'o',
    'a',
    'os',
    'as',
    'um',
    'uma',
    'de',
    'da',
    'do',
    'e',
    'é',
    'em',
    'para',
    'com',
    'que',
    'isso',
    'isto',
    'no',
    'na',
  ]);

  // ==============================
  // Negação & Intensidade
  // ==============================

  private negations = ['não', 'nunca', 'jamais', 'nem'];
  private intensifiers = ['muito', 'extremamente', 'super', 'absurdamente'];
  private diminishers = ['pouco', 'levemente', 'meio'];

  // ==============================
  // Failure verbs
  // ==============================

  private failureVerbs = ['quebrou', 'travou', 'bugou', 'caiu', 'parou'];

  // ==============================
  // Lexicons
  // ==============================

  private negativeLexicon: LexiconEntry[] = [
    { weight: -3, terms: ['péssimo', 'horrível', 'inaceitável'] },
    { weight: -2, terms: ['ruim', 'bugado', 'erro', 'travando'] },
    { weight: -1, terms: ['lento', 'confuso', 'estranho'] },
  ];

  private positiveLexicon: LexiconEntry[] = [
    { weight: 3, terms: ['excelente', 'perfeito', 'impecável'] },
    { weight: 2, terms: ['bom', 'funciona', 'ótimo'] },
    { weight: 1, terms: ['aceitável', 'ok', 'normal'] },
  ];

  // ==============================
  // PIPELINE NLP
  // ==============================

  analyze(sentiment: Sentiment): SentimentResult {
    const normalized = this.normalizeText(sentiment.text);

    const tokens = this.tokenize(normalized);
    const filtered = this.removeStopwords(tokens);
    const stemmed = this.stemTokens(filtered);

    const ngrams = this.generateNGrams(stemmed);

    let score = 0;

    score += this.lexiconScore(stemmed);
    score += this.failureVerbScore(stemmed);
    score += this.negationScore(stemmed);
    score += this.intensityScore(stemmed);
    score += this.frequencyScore(stemmed);
    score += this.ngramScore(ngrams);
    score += this.embeddingSimilarityScore(stemmed);

    const normalizedScore = score / Math.max(stemmed.length, 1);

    let label = SentimentLabel.NEUTRAL;
    if (normalizedScore > 0.05) label = SentimentLabel.POSITIVE;
    if (normalizedScore < -0.05) label = SentimentLabel.NEGATIVE;

    return {
      score: Number(normalizedScore.toFixed(3)),
      label,
    };
  }

  // ==============================
  // 1. Normalização pesada
  // ==============================

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^\w\s]/g, ' ') // remove pontuação
      .replace(/[\u{1F600}-\u{1F64F}]/gu, ' emoji ') // emojis
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ==============================
  // 2. Tokenização
  // ==============================

  private tokenize(text: string): string[] {
    return text.split(' ');
  }

  // ==============================
  // 3. Stopwords
  // ==============================

  private removeStopwords(tokens: string[]): string[] {
    return tokens.filter((t) => !this.stopwords.has(t));
  }

  // ==============================
  // 4. Stemming simples
  // ==============================

  private stemTokens(tokens: string[]): string[] {
    return tokens.map((token) =>
      token
        .replace(/mente$/, '')
        .replace(/coes$/, 'cao')
        .replace(/s$/, ''),
    );
  }

  // ==============================
  // 5. N-grams
  // ==============================

  private generateNGrams(tokens: string[]): string[] {
    const ngrams: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i + 1]) {
        ngrams.push(tokens[i] + ' ' + tokens[i + 1]);
      }
      if (tokens[i + 2]) {
        ngrams.push(tokens[i] + ' ' + tokens[i + 1] + ' ' + tokens[i + 2]);
      }
    }

    return ngrams;
  }

  // ==============================
  // 6. Lexicon + peso posicional
  // ==============================

  private lexiconScore(tokens: string[]): number {
    let score = 0;

    tokens.forEach((token, index) => {
      const positionWeight =
        1 + (tokens.length - index) * this.POSITION_WEIGHT_FACTOR;

      this.positiveLexicon.forEach((entry) => {
        if (entry.terms.includes(token)) {
          score += entry.weight * positionWeight;
        }
      });

      this.negativeLexicon.forEach((entry) => {
        if (entry.terms.includes(token)) {
          score += entry.weight * positionWeight;
        }
      });
    });

    return score;
  }

  // ==============================
  // 7. Failure verbs
  // ==============================

  private failureVerbScore(tokens: string[]): number {
    let score = 0;

    tokens.forEach((t) => {
      if (this.failureVerbs.includes(t)) {
        score -= 2.5;
      }
    });

    return score;
  }

  // ==============================
  // 8. Negação contextual
  // ==============================

  private negationScore(tokens: string[]): number {
    let score = 0;

    tokens.forEach((token, index) => {
      if (this.negations.includes(token)) {
        for (let i = 1; i <= this.NEGATION_WINDOW; i++) {
          const next = tokens[index + i];
          if (!next) continue;

          if (this.isPositive(next)) score -= 2;
          if (this.isNegative(next)) score += 2;
        }
      }
    });

    return score;
  }

  // ==============================
  // 9. Intensidade
  // ==============================

  private intensityScore(tokens: string[]): number {
    let score = 0;

    tokens.forEach((token, index) => {
      const next = tokens[index + 1];
      if (!next) return;

      if (this.intensifiers.includes(token)) {
        if (this.isPositive(next)) score += this.INTENSIFIER_MULTIPLIER;
        if (this.isNegative(next)) score -= this.INTENSIFIER_MULTIPLIER;
      }

      if (this.diminishers.includes(token)) {
        if (this.isPositive(next)) score += this.DIMINISHER_MULTIPLIER;
        if (this.isNegative(next)) score -= this.DIMINISHER_MULTIPLIER;
      }
    });

    return score;
  }

  // ==============================
  // 10. Frequência de termos
  // ==============================

  private frequencyScore(tokens: string[]): number {
    const freq: Record<string, number> = {};

    tokens.forEach((t) => {
      freq[t] = (freq[t] || 0) + 1;
    });

    let score = 0;

    Object.entries(freq).forEach(([term, count]) => {
      if (this.isPositive(term)) score += count * 0.5;
      if (this.isNegative(term)) score -= count * 0.5;
    });

    return score;
  }

  // ==============================
  // 11. N-gram score
  // ==============================

  private ngramScore(ngrams: string[]): number {
    let score = 0;

    ngrams.forEach((g) => {
      if (g.includes('nao bom')) score -= 2;
      if (g.includes('muito bom')) score += 2;
      if (g.includes('nao funciona')) score -= 3;
    });

    return score;
  }

  // ==============================
  // 12. Embedding simulado
  // ==============================

  private embeddingSimilarityScore(tokens: string[]): number {
    const textVector = this.fakeEmbedding(tokens.join(' '));

    const positiveAnchor = this.fakeEmbedding('excelente perfeito otimo');
    const negativeAnchor = this.fakeEmbedding('ruim pessimo horrivel');

    const posSim = this.cosineSimilarity(textVector, positiveAnchor);
    const negSim = this.cosineSimilarity(textVector, negativeAnchor);

    return (posSim - negSim) * 5;
  }

  private fakeEmbedding(text: string): number[] {
    const vector = new Array(this.EMBEDDING_DIMENSION).fill(0);

    for (let i = 0; i < text.length; i++) {
      vector[i % this.EMBEDDING_DIMENSION] += text.charCodeAt(i);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return vector;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0,
      normA = 0,
      normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] ** 2;
      normB += b[i] ** 2;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  // ==============================
  // Helpers
  // ==============================

  private isPositive(term: string): boolean {
    return this.positiveLexicon.some((l) => l.terms.includes(term));
  }

  private isNegative(term: string): boolean {
    return this.negativeLexicon.some((l) => l.terms.includes(term));
  }
}
