export abstract class JobMetricsPort {
  abstract observeJobDuration(seconds: number): void;
}
