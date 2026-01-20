import { Controller, Get } from '@nestjs/common';
import { EvaluateSystemHealthUseCase } from '../../application/use-cases/evaluate-system-health.use-case';

@Controller('system-health')
export class SystemHealthController {
  constructor(
    private readonly evaluateSystemHealth: EvaluateSystemHealthUseCase,
  ) {}

  @Get()
  async getHealth() {
    const health = await this.evaluateSystemHealth.execute();
    return { health };
  }
}
