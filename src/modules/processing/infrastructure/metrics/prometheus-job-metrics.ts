import { Histogram } from 'prom-client';
import { JobMetricsPort } from 'src/modules/processing/application/ports/job-metrics.port';

export class PrometheusJobMetrics implements JobMetricsPort {
  private readonly jobDuration = new Histogram({
    name: 'processing_job_duration_seconds',
    help: 'Latência end-to-end de cada job de análise de sentimento',
    buckets: [0.1, 0.25, 0.5, 1, 2, 5, 10],
  });

  observeJobDuration(seconds: number): void {
    this.jobDuration.observe(seconds);
  }
}
