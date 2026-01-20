import { SystemHealthStatus } from '../../domain/enums/system-health-status.enum';
import { HealthMetrics } from '../../domain/value-objects/health-metrics';

export interface SystemHealthResponseDTO {
  status: SystemHealthStatus;
  metrics: HealthMetrics;
}
