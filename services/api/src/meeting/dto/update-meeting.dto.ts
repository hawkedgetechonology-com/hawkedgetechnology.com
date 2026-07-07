import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsISO8601, IsNumber, IsEnum } from 'class-validator';
import { MeetingStatus } from '@hawkedge/database';

export class UpdateMeetingDto {
  @ApiPropertyOptional({ example: 'Consultation with LogixFlow Global' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Technical architecture review' })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ example: 'Client wants to discuss AWS vs GCP hosting bounds.' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: '2026-07-10T10:00:00.000Z' })
  @IsISO8601()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 'CONFIRMED', enum: MeetingStatus })
  @IsEnum(MeetingStatus)
  @IsOptional()
  status?: MeetingStatus;
}
