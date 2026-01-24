import { Module } from '@nestjs/common';
import { MetricsService } from './domain/services/metrices.service';
import { MetricsController } from './infrastructure/controllers/metrics.controller';
import { MetricsInterceptor } from './infrastructure/interceptors/metrics.interceptor';

@Module({
  providers: [MetricsService, MetricsInterceptor],
  controllers: [MetricsController],
  exports: [MetricsService],
})
export class MetricsModule {}
