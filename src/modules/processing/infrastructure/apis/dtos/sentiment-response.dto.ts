enum SentimentLabel {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

export interface SentimentResponseDTO {
  label: SentimentLabel;
  score: number;
}
