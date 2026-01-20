import { EvaluateSystemHealthUseCase } from './application/use-cases/evaluate-system-health.use-case';
import { HealthMetricsReader } from './domain/repositories/health-metrics.repository';
import { HealthEvaluator } from './domain/services/health-evaluator';

export const systemHealthUseCasesProviders = [
  {
    provide: EvaluateSystemHealthUseCase,
    useFactory: (
      healthMetricsReader: HealthMetricsReader,
      healthEvaluator: HealthEvaluator,
    ) => new EvaluateSystemHealthUseCase(healthMetricsReader, healthEvaluator),
    inject: ['FeedbackHealthReader', HealthEvaluator],
  },
];
