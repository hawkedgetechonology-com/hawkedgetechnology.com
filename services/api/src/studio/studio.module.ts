import { Module } from '@nestjs/common';
import { StudioDashboardController } from './studio-dashboard.controller';
import { StudioDashboardService } from './studio-dashboard.service';
import { StudioProjectController } from './studio-project.controller';
import { StudioProjectService } from './studio-project.service';
import { StudioInvoiceController } from './studio-invoice.controller';
import { StudioInvoiceService } from './studio-invoice.service';
import { StudioSupportController } from './studio-support.controller';
import { StudioSupportService } from './studio-support.service';
import { StudioNotificationController } from './studio-notification.controller';
import { StudioNotificationService } from './studio-notification.service';
import { StudioProfileController } from './studio-profile.controller';
import { StudioProfileService } from './studio-profile.service';
import { StudioSettingsController } from './studio-settings.controller';
import { StudioSettingsService } from './studio-settings.service';

@Module({
  controllers: [
    StudioDashboardController,
    StudioProjectController,
    StudioInvoiceController,
    StudioSupportController,
    StudioNotificationController,
    StudioProfileController,
    StudioSettingsController,
  ],
  providers: [
    StudioDashboardService,
    StudioProjectService,
    StudioInvoiceService,
    StudioSupportService,
    StudioNotificationService,
    StudioProfileService,
    StudioSettingsService,
  ],
})
export class StudioModule {}
