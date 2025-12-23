import { Module } from '@nestjs/common';
import { SystemHealthModule } from './modules/system-health/system-health.module';
import { SentimentModule } from './modules/sentiment/sentiment.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TicketModule,
    FeedbackModule,
    SentimentModule,
    SystemHealthModule,
  ],
})
export class AppModule {}
