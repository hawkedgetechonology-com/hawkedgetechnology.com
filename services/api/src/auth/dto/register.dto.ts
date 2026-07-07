import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'rohit@velohealth.tech' })
  @IsEmail({}, { message: 'Invalid email address format.' })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8, { message: 'Password key must be at least 8 characters long.' })
  password: string;

  @ApiProperty({ example: 'Rohit' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @ApiProperty({ example: 'Sharma' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  // Student specific details (optional at general registration)
  @ApiPropertyOptional({ example: 'IIT Bombay' })
  @IsString()
  @IsOptional()
  college?: string;

  @ApiPropertyOptional({ example: 2027 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  graduationYear?: number;
}
export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  token: string;
}
