import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsISO8601, IsNumber } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({ example: 'clx1234567890abcdef' })
  @IsString()
  @IsNotEmpty()
  leadId!: string;

  @ApiProperty({ example: 'Consultation with LogixFlow Global' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Technical architecture review' })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ example: 'Client wants to discuss AWS vs GCP hosting bounds.' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: '2026-07-10T10:00:00.000Z' })
  @IsISO8601()
  @IsNotEmpty()
  scheduledAt!: string;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;
}
