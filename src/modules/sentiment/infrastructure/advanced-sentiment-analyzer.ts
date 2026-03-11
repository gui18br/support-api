import { Sentiment } from '../domain/entities/sentiment.entity';
import { SentimentLabel } from '../domain/enums/sentiment-label.enum';
import { SentimentAnalyzer } from '../domain/repositories/sentiment.repository';
import { SentimentResult } from '../domain/value-objects/sentiment-result';

type LexiconEntry = {
  weight: number;
  terms: string[];
};

export class AdvancedSentimentAnalyzer implements SentimentAnalyzer {
  private NEGATION_WINDOW = 4;
  private POSITION_WEIGHT_FACTOR = 0.15;
  private VECTOR_DIM = 1536;

  // ==============================
  // STOPWORDS
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
    'nos',
    'nas',
    'por',
    'como',
    'mais',
    'menos',
  ]);

  // ==============================
  // MODIFIERS
  // ==============================

  private negations = ['nao', 'nunca', 'jamais', 'nem'];

  private intensifiers = [
    'muito',
    'extremamente',
    'super',
    'absurdamente',
    'bastante',
  ];

  private diminishers = ['pouco', 'levemente', 'meio', 'relativamente'];

  private failureVerbs = [
    'quebrou',
    'travou',
    'bugou',
    'caiu',
    'parou',
    'falhou',
    'congelou',
  ];

  // ==============================
  // LEXICONS
  // ==============================

  private negativeLexicon: LexiconEntry[] = [
    { weight: -3, terms: ['pessimo', 'horrivel', 'inaceitavel', 'frustrante'] },

    {
      weight: -2,
      terms: [
        'ruim',
        'erro',
        'falha',
        'falhas',
        'problema',
        'problemas',
        'bug',
        'bugs',
        'travamento',
        'travamentos',
        'instabilidade',
        'degradacao',
        'lentidao',
        'perda',
        'inconsistencia',
      ],
    },

    {
      weight: -1,
      terms: ['lento', 'confuso', 'demorado', 'complexo', 'limitante'],
    },
  ];

  private positiveLexicon: LexiconEntry[] = [
    { weight: 3, terms: ['excelente', 'perfeito', 'impecavel'] },

    { weight: 2, terms: ['bom', 'funciona', 'otimo', 'rapido'] },

    { weight: 1, terms: ['aceitavel', 'ok', 'normal', 'estavel'] },
  ];

  // ==============================
  // COMPLAINT EXPRESSIONS
  // ==============================

  private complaintExpressions = [
    'oportunidade de melhoria',
    'ainda existem',
    'continua apresentando',
    'ainda apresenta',
    'nao esta otimizado',
    'tempo de resposta alto',
    'mensagem de erro',
    'perda de informacao',
    'ficar sem resposta',
  ];

  // ==============================
  // MAIN
  // ==============================

  analyze(sentiment: Sentiment): SentimentResult {
    const normalized = this.normalizeText(sentiment.text);

    const tokens = this.tokenize(normalized);
    const filtered = this.removeStopwords(tokens);
    const stemmed = this.stemTokens(filtered);

    const ngrams = this.generateNGrams(stemmed);

    let score = 0;

    score += this.lexiconScore(stemmed);
    score += this.negationScore(stemmed);
    score += this.intensityScore(stemmed);
    score += this.failureVerbScore(stemmed);
    score += this.tfidfScore(stemmed);
    score += this.ngramScore(ngrams);
    score += this.syntacticScore(stemmed);
    score += this.semanticDistanceScore(stemmed);
    score += this.embeddingScore(stemmed);

    const graph = this.buildCoOccurrenceGraph(stemmed);

    score += this.sentimentPropagation(graph);

    const ranks = this.pageRank(graph);

    score += this.graphRankSentiment(ranks);

    score += this.globalSemanticSimilarity(stemmed);

    score += this.complaintScore(normalized);

    // CORREÇÃO IMPORTANTE
    const normalizedScore = score / Math.sqrt(stemmed.length + 1);

    let label = SentimentLabel.NEUTRAL;

    if (normalizedScore > 0.2) label = SentimentLabel.POSITIVE;
    if (normalizedScore < -0.2) label = SentimentLabel.NEGATIVE;

    return {
      score: Number(normalizedScore.toFixed(3)),
      label,
    };
  }

  // ==============================
  // NORMALIZATION
  // ==============================

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private tokenize(text: string): string[] {
    return text.split(' ');
  }

  private removeStopwords(tokens: string[]): string[] {
    return tokens.filter((t) => !this.stopwords.has(t));
  }

  private stemTokens(tokens: string[]): string[] {
    return tokens.map((token) =>
      token
        .replace(/mente$/, '')
        .replace(/coes$/, 'cao')
        .replace(/s$/, ''),
    );
  }

  // ==============================
  // NGRAMS
  // ==============================

  private generateNGrams(tokens: string[]): string[] {
    const ngrams: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i + 1]) ngrams.push(tokens[i] + ' ' + tokens[i + 1]);

      if (tokens[i + 2])
        ngrams.push(tokens[i] + ' ' + tokens[i + 1] + ' ' + tokens[i + 2]);
    }

    return ngrams;
  }

  private ngramScore(ngrams: string[]): number {
    let score = 0;

    ngrams.forEach((g) => {
      if (g.includes('nao bom')) score -= 2;
      if (g.includes('muito bom')) score += 2;
      if (g.includes('nao funciona')) score -= 3;

      if (g.includes('tempo resposta alto')) score -= 2;
      if (g.includes('mensagem erro')) score -= 2;
      if (g.includes('perda informacao')) score -= 3;
    });

    return score;
  }

  // ==============================
  // POS TAGGING SIMPLE
  // ==============================

  private posTag(token: string): string {
    if (token.endsWith('mente')) return 'ADV';

    if (token.endsWith('ar') || token.endsWith('er') || token.endsWith('ir'))
      return 'VERB';

    if (this.isPositive(token) || this.isNegative(token)) return 'ADJ';

    return 'NOUN';
  }

  private syntacticScore(tokens: string[]): number {
    let score = 0;

    tokens.forEach((token) => {
      const tag = this.posTag(token);

      if (tag === 'ADJ') {
        if (this.isPositive(token)) score += 1.2;

        if (this.isNegative(token)) score -= 1.2;
      }
    });

    return score;
  }

  // ==============================
  // LEXICON SCORE
  // ==============================

  private lexiconScore(tokens: string[]): number {
    let score = 0;

    tokens.forEach((token, index) => {
      const positionWeight =
        1 + (tokens.length - index) * this.POSITION_WEIGHT_FACTOR;

      this.positiveLexicon.forEach((entry) => {
        if (entry.terms.includes(token)) score += entry.weight * positionWeight;
      });

      this.negativeLexicon.forEach((entry) => {
        if (entry.terms.includes(token)) score += entry.weight * positionWeight;
      });
    });

    return score;
  }

  // ==============================
  // FAILURE VERBS
  // ==============================

  private failureVerbScore(tokens: string[]): number {
    let score = 0;

    tokens.forEach((t) => {
      if (this.failureVerbs.includes(t)) score -= 2.5;
    });

    return score;
  }

  // ==============================
  // NEGATION
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
  // INTENSITY
  // ==============================

  private intensityScore(tokens: string[]): number {
    let score = 0;

    tokens.forEach((token, index) => {
      const next = tokens[index + 1];
      if (!next) return;

      if (this.intensifiers.includes(token)) {
        if (this.isPositive(next)) score += 1.8;
        if (this.isNegative(next)) score -= 1.8;
      }

      if (this.diminishers.includes(token)) {
        if (this.isPositive(next)) score += 0.6;
        if (this.isNegative(next)) score -= 0.6;
      }
    });

    return score;
  }

  // ==============================
  // TFIDF
  // ==============================

  private tfidfScore(tokens: string[]): number {
    const freq: Record<string, number> = {};

    tokens.forEach((t) => {
      freq[t] = (freq[t] || 0) + 1;
    });

    let score = 0;

    Object.entries(freq).forEach(([term, count]) => {
      const tf = count / tokens.length;
      const idf = Math.log(10000 / (1 + count));

      const weight = tf * idf;

      if (this.isPositive(term)) score += weight;
      if (this.isNegative(term)) score -= weight;
    });

    return score;
  }

  // ==============================
  // GRAPH
  // ==============================

  private buildCoOccurrenceGraph(tokens: string[]) {
    const graph = new Map<string, Map<string, number>>();

    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const a = tokens[i];
        const b = tokens[j];

        if (!graph.has(a)) graph.set(a, new Map());
        if (!graph.has(b)) graph.set(b, new Map());

        const edges = graph.get(a)!;

        edges.set(b, (edges.get(b) || 0) + 1);
      }
    }

    return graph;
  }

  private pageRank(graph: Map<string, Map<string, number>>, iterations = 30) {
    const ranks = new Map<string, number>();

    graph.forEach((_, node) => ranks.set(node, 1));

    for (let i = 0; i < iterations; i++) {
      const newRanks = new Map<string, number>();

      graph.forEach((edges, node) => {
        let sum = 0;

        edges.forEach((_, neighbor) => {
          sum += (ranks.get(neighbor) || 1) / edges.size;
        });

        newRanks.set(node, 0.15 + 0.85 * sum);
      });

      newRanks.forEach((v, k) => ranks.set(k, v));
    }

    return ranks;
  }

  private graphRankSentiment(ranks: Map<string, number>) {
    let score = 0;

    ranks.forEach((rank, token) => {
      if (this.isPositive(token)) score += rank;
      if (this.isNegative(token)) score -= rank;
    });

    return score;
  }

  private sentimentPropagation(graph: Map<string, Map<string, number>>) {
    let score = 0;

    graph.forEach((edges, node) => {
      edges.forEach((_, neighbor) => {
        if (this.isPositive(node) && this.isPositive(neighbor)) score += 0.5;

        if (this.isNegative(node) && this.isNegative(neighbor)) score -= 0.5;
      });
    });

    return score;
  }

  // ==============================
  // SEMANTIC
  // ==============================

  private globalSemanticSimilarity(tokens: string[]): number {
    let score = 0;

    const vectors = tokens.map((t) => this.tokenVector(t));

    for (let i = 0; i < vectors.length; i++) {
      for (let j = i + 1; j < vectors.length; j++) {
        score += this.cosineSimilarity(vectors[i], vectors[j]);
      }
    }

    return score / (tokens.length || 1);
  }

  private tokenVector(token: string): number[] {
    const vec = new Array(this.VECTOR_DIM).fill(0);

    for (let i = 0; i < token.length; i++) {
      const idx = (token.charCodeAt(i) * 31) % this.VECTOR_DIM;

      vec[idx] += 1;
    }

    return vec;
  }

  private sentenceVector(tokens: string[]): number[] {
    const vec = new Array(this.VECTOR_DIM).fill(0);

    tokens.forEach((token) => {
      const tv = this.tokenVector(token);

      for (let i = 0; i < this.VECTOR_DIM; i++) vec[i] += tv[i];
    });

    return vec;
  }

  private embeddingScore(tokens: string[]): number {
    const textVec = this.sentenceVector(tokens);

    const posVec = this.sentenceVector(['excelente', 'perfeito', 'otimo']);
    const negVec = this.sentenceVector(['ruim', 'pessimo', 'horrivel']);

    const posSim = this.cosineSimilarity(textVec, posVec);
    const negSim = this.cosineSimilarity(textVec, negVec);

    return (posSim - negSim) * 2;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0,
      normA = 0,
      normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  // ==============================
  // SEMANTIC DISTANCE
  // ==============================

  private semanticDistanceScore(tokens: string[]): number {
    let score = 0;

    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const dist = this.levenshtein(tokens[i], tokens[j]);

        if (dist <= 2) {
          if (this.isPositive(tokens[i])) score += 0.2;
          if (this.isNegative(tokens[i])) score -= 0.2;
        }
      }
    }

    return score;
  }

  // ==============================
  // COMPLAINT DETECTOR
  // ==============================

  private complaintScore(text: string) {
    let score = 0;

    this.complaintExpressions.forEach((expr) => {
      if (text.includes(expr)) score -= 2;
    });

    return score;
  }

  // ==============================
  // LEVENSHTEIN
  // ==============================

  private levenshtein(a: string, b: string) {
    const matrix: number[][] = Array.from({ length: b.length + 1 }, () => []);

    for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1))
          matrix[i][j] = matrix[i - 1][j - 1];
        else
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
      }
    }

    return matrix[b.length][a.length];
  }

  // ==============================
  // HELPERS
  // ==============================

  private isPositive(term: string): boolean {
    return this.positiveLexicon.some((l) => l.terms.includes(term));
  }

  private isNegative(term: string): boolean {
    return this.negativeLexicon.some((l) => l.terms.includes(term));
  }
}
