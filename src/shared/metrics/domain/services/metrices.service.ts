import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestDuration: Histogram<string>;

  constructor() {
    collectDefaultMetrics();

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests',
      labelNames: ['method', 'route', 'status'] as const,
    });
  }

  observe(
    method: string,
    route: string,
    status: number,
    duration: number,
  ): void {
    this.httpRequestDuration
      .labels(method, route, status.toString())
      .observe(duration);
  }

  async getMetrics() {
    return register.metrics();
  }
}
