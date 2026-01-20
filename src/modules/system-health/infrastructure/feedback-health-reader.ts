import type { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';

import { HealthMetrics } from '../domain/value-objects/health-metrics';
import { SentimentLabel } from 'src/modules/sentiment/domain/enums/sentiment-label.enum';
import { HealthMetricsReader } from '../domain/repositories/health-metrics.repository';
import { Inject } from '@nestjs/common';

export class FeedbackHealthReader implements HealthMetricsReader {
  constructor(
    @Inject('FeedbackRepository')
    private readonly repo: FeedbackRepository,
  ) {}

  async collectMetrics(): Promise<HealthMetrics> {
    const feedbacks = await this.repo.findAnalyzed();

    const feedbackCount = feedbacks.length;
    const negativeCount = feedbacks.filter(
      (f) => f.sentimentLabel === SentimentLabel.NEGATIVE,
    ).length;

    const averageScore =
      feedbacks.reduce((sum, f) => sum + (f.sentimentScore ?? 0), 0) /
      Math.max(feedbackCount, 1);

    return {
      feedbackCount,
      negativePercentage: (negativeCount / Math.max(feedbackCount, 1)) * 100,
      averageScore,
    };
  }
}
