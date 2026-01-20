import { SystemHealthStatus } from '../enums/system-health-status.enum';
import { HealthMetrics } from '../value-objects/health-metrics';

export class HealthEvaluator {
  evaluate(metrics: HealthMetrics): SystemHealthStatus {
    if (metrics.negativePercentage > 40 || metrics.averageScore < -0.3) {
      return SystemHealthStatus.CRITICAL;
    }

    if (metrics.negativePercentage > 20 || metrics.averageScore < -0.1) {
      return SystemHealthStatus.ATTENTION;
    }

    return SystemHealthStatus.HEALTHY;
  }
}
