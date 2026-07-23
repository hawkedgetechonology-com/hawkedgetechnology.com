import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { ProjectsModule } from './projects/projects.module';
import { QuotationsModule } from './quotations/quotations.module';
import { SupportModule } from './support/support.module';
import { FilesModule } from './files/files.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { AuditModule } from './audit/audit.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, UsersModule, LeadsModule, ProjectsModule, QuotationsModule, SupportModule, FilesModule, NotificationsModule, DashboardModule, SettingsModule, AuditModule, CommonModule, PrismaModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
