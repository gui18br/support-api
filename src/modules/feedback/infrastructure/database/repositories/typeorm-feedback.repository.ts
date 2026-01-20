import { Feedback } from 'src/modules/feedback/domain/entities/feedback.entity';
import { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';
import { FeedbackMapper } from '../mapper/feedback.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEntity } from '../entities/feedback.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmFeedbackRepository implements FeedbackRepository {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly ormRepo: Repository<FeedbackEntity>,
  ) {}

  async findAnalyzed(): Promise<Feedback[]> {
    const entities = await this.ormRepo.find({
      where: { sentiment_analyzed_at: Not(IsNull()) },
      relations: {
        ticket: true,
      },
    });

    return FeedbackMapper.toDomainArray(entities);
  }

  async findNotAnalyzed(): Promise<Feedback[]> {
    const entities = await this.ormRepo.find({
      where: { sentiment_analyzed_at: IsNull() },
      relations: {
        ticket: true,
      },
    });

    return FeedbackMapper.toDomainArray(entities);
  }

  async save(feedback: Feedback): Promise<void> {
    const entity = FeedbackMapper.toEntity(feedback);
    await this.ormRepo.save(entity);
  }
}
