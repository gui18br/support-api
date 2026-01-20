import { HealthMetricsReader } from '../../domain/repositories/health-metrics.repository';
import { HealthEvaluator } from '../../domain/services/health-evaluator';
import { SystemHealthResponseDTO } from '../dtos/system-health-response';

export class EvaluateSystemHealthUseCase {
  constructor(
    private readonly healthMetricsReader: HealthMetricsReader,
    private readonly healthEvaluator: HealthEvaluator,
  ) {}

  async execute(): Promise<SystemHealthResponseDTO> {
    const metrics = await this.healthMetricsReader.collectMetrics();
    const status = this.healthEvaluator.evaluate(metrics);

    return {
      status,
      metrics,
    };
  }
}
