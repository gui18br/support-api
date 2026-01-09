import { Feedback } from 'src/modules/feedback/domain/entities/feedback.entity';
import { FeedbackRepository } from 'src/modules/feedback/domain/repositories/feedback.repository';
import { FeedbackMapper } from '../mapper/feedback.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEntity } from '../entities/feedback.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmFeedbackRepository implements FeedbackRepository {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly ormRepo: Repository<FeedbackEntity>,
  ) {}

  async save(feedback: Feedback): Promise<void> {
    const entity = FeedbackMapper.toEntity(feedback);
    await this.ormRepo.save(entity);
  }
}
