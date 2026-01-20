import { HealthMetrics } from '../value-objects/health-metrics';

export interface HealthMetricsReader {
  collectMetrics(): Promise<HealthMetrics>;
}
