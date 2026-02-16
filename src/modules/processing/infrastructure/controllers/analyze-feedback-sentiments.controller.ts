import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AnalyzeFeedbackSentimentsJob } from '../../application/jobs/analyze-feedback-sentiments.job';

@Controller('admin/feedbacks')
export class AnalyzeFeedbackSentimentController {
  constructor(private readonly job: AnalyzeFeedbackSentimentsJob) {}

  @Post('analyze-sentiments')
  @HttpCode(HttpStatus.ACCEPTED)
  async runManually(): Promise<{ message: string }> {
    await this.job.run();

    return {
      message: 'Sentiment analyses job executed successfully',
    };
  }
}
