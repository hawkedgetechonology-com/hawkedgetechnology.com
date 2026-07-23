import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    const user = await this.authService.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const tokenData = await this.authService.login(user);
    // Return token + user role so the frontend can redirect correctly
    return {
      ...tokenData,
      role: user.role,
    };
  }

  @Post('register')
  async register(@Body() registerDto: Prisma.UserCreateInput) {
    return this.authService.register(registerDto);
  }
}
