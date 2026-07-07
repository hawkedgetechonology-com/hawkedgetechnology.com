import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber, IsObject } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'David Chen' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'NeuralDoc Systems' })
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiProperty({ example: 'dchen@neuraldoc.ai' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'AI_SOLUTION' })
  @IsString()
  @IsNotEmpty()
  buildType!: string;

  @ApiProperty({ example: 92 })
  @IsNumber()
  @IsNotEmpty()
  leadScore!: number;

  @ApiProperty({ example: 'HIGH' })
  @IsString()
  @IsNotEmpty()
  leadPriority!: string;

  @ApiProperty({ example: { buildType: 'ai_solution', ai_budget: '$100k - $250k' } })
  @IsObject()
  @IsNotEmpty()
  rawAnswers!: Record<string, unknown>;
}
