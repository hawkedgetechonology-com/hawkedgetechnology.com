import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'rohit@velohealth.tech' })
  @IsEmail({}, { message: 'Invalid email address format.' })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
export class TokenRefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
