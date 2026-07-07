import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LeadModule } from './lead/lead.module';
import { MeetingModule } from './meeting/meeting.module';
import { ProposalModule } from './proposal/proposal.module';
import { StudioModule } from './studio/studio.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { SecurityMiddleware } from './common/middleware/security.middleware';

@Module({
  imports: [DatabaseModule, CacheModule, AuthModule, UserModule, LeadModule, MeetingModule, ProposalModule, StudioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, SecurityMiddleware)
      .forRoutes('*');
  }
}
