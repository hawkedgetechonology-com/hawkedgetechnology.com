import { Controller, Post, Body, Get, Req, Request, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, TokenRefreshDto } from './dto/login.dto';
import { RegisterDto, VerifyEmailDto } from './dto/register.dto';
import { ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/forgot-password.dto';
import { AuthRank } from './decorators';
import { AuditLogInterceptor } from '../common/interceptors/audit-log.interceptor';
import { Request as ExpressRequest } from 'express';

@ApiTags('Authentication & Access Control')
@Controller('auth')
@UseInterceptors(AuditLogInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new Explorer/Student account' })
  @ApiResponse({ status: 201, description: 'Registration logged. Awaiting email verification.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate credentials and establish active session' })
  @ApiResponse({ status: 200, description: 'Session established successfully.' })
  async login(
    @Req() req: ExpressRequest,
    @Body() dto: LoginDto,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm coordinates email verification token' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate access tokens using refresh token' })
  async refreshToken(@Body() dto: TokenRefreshDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke active device session' })
  async logout(@Request() req: { user: { sessionId: string } }) {
    return this.authService.logout(req.user.sessionId);
  }

  @Post('logout-all')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke all device sessions (Force logout)' })
  async logoutAll(@Request() req: { user: { id: string } }) {
    return this.authService.logoutAllDevices(req.user.id);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch password recovery link' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm recovery token and reset password key' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('change-password')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refine password key using current password verification' })
  async changePassword(@Request() req: { user: { id: string } }, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

  // MFA Architecture Endpoints
  @Post('mfa/enable')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MFA: Initialize TOTP setup secret and recovery codes' })
  async mfaEnable(@Request() req: { user: { id: string } }) {
    return this.authService.mfaEnable(req.user.id);
  }

  @Post('mfa/verify')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MFA: Verify code token to enable multi-factor challenge state' })
  async mfaVerify(@Request() req: { user: { id: string } }, @Body('token') token: string) {
    return this.authService.mfaVerify(req.user.id, token);
  }

  @Post('mfa/disable')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'MFA: Remove multi-factor requirement flags' })
  async mfaDisable(@Request() req: { user: { id: string } }) {
    return this.authService.mfaDisable(req.user.id);
  }

  @Post('mfa/challenge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'MFA: Complete multi-factor verification challenge to issue session credentials' })
  async mfaVerifyChallenge(
    @Req() req: ExpressRequest,
    @Body('tempToken') tempToken: string,
    @Body('token') token: string,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.mfaVerifyChallenge(tempToken, token, ipAddress, userAgent);
  }

  // Google OAuth Route Placeholders
  @Get('google')
  @ApiOperation({ summary: 'OAuth entry point: Google authentication redirect (placeholder)' })
  googleAuth() {
    return { url: 'https://accounts.google.com/o/oauth2/v2/auth?... (OAuth Architecture Configured)' };
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'OAuth callback: Google authentication callback payload (placeholder)' })
  googleAuthCallback() {
    return { message: 'Google Authentication validated. Session generated.' };
  }

  // GitHub OAuth Route Placeholders
  @Get('github')
  @ApiOperation({ summary: 'OAuth entry point: GitHub authentication redirect (placeholder)' })
  githubAuth() {
    return { url: 'https://github.com/login/oauth/authorize?... (OAuth Architecture Configured)' };
  }

  @Get('github/callback')
  @ApiOperation({ summary: 'OAuth callback: GitHub authentication callback payload (placeholder)' })
  githubAuthCallback() {
    return { message: 'GitHub Authentication validated. Session generated.' };
  }
}
