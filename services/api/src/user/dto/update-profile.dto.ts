import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsArray, IsObject, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Rohit' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'https://cloudinary.com/avatar.jpg' })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Business Park' })
  @IsString()
  @IsOptional()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Sector 5' })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '400001' })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/rohit' })
  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/rohit' })
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({ example: ['React', 'NestJS'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiPropertyOptional({ example: 'VeloHealth Technologies' })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({ example: 'https://velohealth.tech' })
  @IsUrl()
  @IsOptional()
  companyWebsite?: string;

  @ApiPropertyOptional({ example: '27AAAAA1111A1Z1' })
  @IsString()
  @IsOptional()
  companyGst?: string;

  @ApiPropertyOptional({ example: { theme: 'dark' } })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, unknown>;

  @ApiPropertyOptional({ example: { email: true, whatsapp: false } })
  @IsObject()
  @IsOptional()
  notificationSettings?: Record<string, unknown>;
}
export class AdminUpdateUserDto {
  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

  @ApiPropertyOptional({ example: 'CLIENT' })
  @IsString()
  @IsOptional()
  rank?: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MENTOR' | 'TRAINER' | 'STUDENT' | 'CLIENT' | 'GUEST';

  @ApiPropertyOptional({ type: () => UpdateProfileDto })
  @IsObject()
  @IsOptional()
  profile?: UpdateProfileDto;
}
