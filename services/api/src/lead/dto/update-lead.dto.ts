import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsNumber, IsEnum } from 'class-validator';
import { LeadStatus } from '@hawkedge/database';

export class UpdateLeadDto {
  @ApiPropertyOptional({ example: 'David Chen' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'NeuralDoc Systems' })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({ example: 'dchen@neuraldoc.ai' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'AI_SOLUTION' })
  @IsString()
  @IsOptional()
  buildType?: string;

  @ApiPropertyOptional({ example: 92 })
  @IsNumber()
  @IsOptional()
  leadScore?: number;

  @ApiPropertyOptional({ example: 'HIGH' })
  @IsString()
  @IsOptional()
  leadPriority?: string;

  @ApiPropertyOptional({ example: 'CONTACTED', enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ example: 'admin-user-id' })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'Discussed cloud migration pipeline targets.' })
  @IsString()
  @IsOptional()
  internalNotes?: string;
}
