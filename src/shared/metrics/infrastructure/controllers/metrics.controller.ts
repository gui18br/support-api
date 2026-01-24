import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from '../../domain/services/metrices.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async metrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
