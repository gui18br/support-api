import { Sentiment } from '../domain/entities/sentiment.entity';
import { SentimentLabel } from '../domain/enums/sentiment-label.enum';
import { SentimentAnalyzer } from '../domain/repositories/sentiment.repository';
import { SentimentResult } from '../domain/value-objects/sentiment-result';

export class SimpleSentimentAnalyzer implements SentimentAnalyzer {
  private failureVerbs = ['quebrou', 'travou', 'bugou', 'caiu', 'parou'];

  private negativeLexicon = {
    forte: {
      weight: -3,
      terms: ['péssimo', 'horrível', 'inaceitável', 'quebrou tudo'],
    },
    medio: {
      weight: -2,
      terms: ['ruim', 'bugado', 'não funciona', 'travando', 'erro'],
    },
    fraco: {
      weight: -1,
      terms: ['estranho', 'fora do normal', 'confuso', 'lento'],
    },
  };

  private positiveLexicon = {
    forte: {
      weight: 3,
      terms: ['excelente', 'perfeito', 'impecável'],
    },
    medio: {
      weight: 2,
      terms: ['bom', 'funciona bem', 'ok', 'resolvido'],
    },
    fraco: {
      weight: 1,
      terms: ['aceitável', 'normal', 'esperado'],
    },
  };

  private applyLexicon(
    text: string,
    lexicon: { weight: number; terms: string[] }[],
  ): number {
    let score = 0;

    lexicon.forEach(({ weight, terms }) => {
      terms.forEach((term) => {
        if (text.includes(term)) score += weight;
      });
    });

    return score;
  }

  analyze(sentiment: Sentiment): SentimentResult {
    const normalized = sentiment.text.toLowerCase();

    let score = 0;

    score += this.applyLexicon(normalized, Object.values(this.negativeLexicon));
    score += this.applyLexicon(normalized, Object.values(this.positiveLexicon));

    this.failureVerbs.forEach((verb) => {
      if (normalized.includes(verb)) score -= 2;
    });

    const wordCount = normalized.split(/\s+/).length;
    const normalizedScore = score / Math.max(wordCount, 1);

    let label = SentimentLabel.NEUTRAL;
    if (normalizedScore > 0.05) label = SentimentLabel.POSITIVE;
    if (normalizedScore < -0.05) label = SentimentLabel.NEGATIVE;

    return { score: Number(normalizedScore.toFixed(2)), label };
  }
}
