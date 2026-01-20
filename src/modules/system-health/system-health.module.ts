import { Module } from '@nestjs/common';
import { HealthEvaluator } from './domain/services/health-evaluator';
import { FeedbackHealthReader } from './infrastructure/feedback-health-reader';
import { systemHealthUseCasesProviders } from './system-health.usecases.provider';
import { EvaluateSystemHealthUseCase } from './application/use-cases/evaluate-system-health.use-case';
import { FeedbackModule } from '../feedback/feedback.module';
import { SystemHealthController } from './infrastructure/controller/system-health.controller';

@Module({
  imports: [FeedbackModule],
  controllers: [SystemHealthController],
  providers: [
    HealthEvaluator,
    {
      provide: 'FeedbackHealthReader',
      useClass: FeedbackHealthReader,
    },

    ...systemHealthUseCasesProviders,
  ],
  exports: [EvaluateSystemHealthUseCase],
})
export class SystemHealthModule {}
