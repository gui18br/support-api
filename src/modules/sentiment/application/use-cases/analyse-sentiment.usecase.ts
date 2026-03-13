import { Sentiment } from '../../domain/entities/sentiment.entity';
import { SentimentAnalyzer } from '../../domain/repositories/sentiment.repository';
import { SentimentResult } from '../../domain/value-objects/sentiment-result';
import { SentimentMetricsPort } from '../ports/sentiment-metrics.port';

export class AnalyzeSentimentUseCase {
  constructor(
    private analyzer: SentimentAnalyzer,
    private readonly metrics: SentimentMetricsPort,
  ) {}

  execute(sentiment: Sentiment): SentimentResult {
    // Tempo inicial do processamento
    const start = process.hrtime.bigint();

    // CPU usada antes do job
    const cpuBefore = process.cpuUsage();

    // Heap usado antes
    const memBefore = process.memoryUsage();

    try {
      const result = this.analyzer.analyze(sentiment);

      // contador de análises realizadas
      this.metrics.incrementRequest(result.label);

      return result;
    } catch (error) {
      // contador de erros
      this.metrics.incrementError();
      throw error;
    } finally {
      // -------------------------
      // Tempo de execução
      // -------------------------

      const durationNs = process.hrtime.bigint() - start;
      const durationSeconds = Number(durationNs) / 1e9;

      this.metrics.observeProcessingTime(durationSeconds);

      // -------------------------
      // CPU usada pelo job
      // -------------------------

      const cpuAfter = process.cpuUsage(cpuBefore);

      // cpuUsage retorna microssegundos
      const cpuSeconds = (cpuAfter.user + cpuAfter.system) / 1_000_000;

      this.metrics.observeCpuUsage(cpuSeconds);

      // -------------------------
      // Memória heap usada
      // -------------------------

      const memAfter = process.memoryUsage();

      const heapDiff = memAfter.heapUsed - memBefore.heapUsed;

      // registra quanto o heap variou durante o job
      this.metrics.observeHeapUsage(heapDiff);
    }
  }
}
