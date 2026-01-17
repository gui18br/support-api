import { Module } from '@nestjs/common';
import { SystemHealthModule } from './modules/system-health/system-health.module';
import { SentimentModule } from './modules/sentiment/sentiment.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TicketModule,
    FeedbackModule,
    SentimentModule,
    SystemHealthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
