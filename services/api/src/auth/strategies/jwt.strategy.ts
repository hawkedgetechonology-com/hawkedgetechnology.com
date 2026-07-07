import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@hawkedge/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'hawkedge_access_secret_key_development_only_change_in_production',
    });
  }

  async validate(payload: TokenPayload) {
    if (!payload || !payload.sub || payload.status === 'SUSPENDED') {
      throw new UnauthorizedException('Access token is invalid or user is suspended.');
    }
    return {
      id: payload.sub,
      email: payload.email,
      rank: payload.rank,
      status: payload.status,
      sessionId: payload.sessionId,
    };
  }
}
