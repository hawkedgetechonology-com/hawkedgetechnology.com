import { SignJWT, jwtVerify } from 'jose';
import { TokenPayload, UserRank } from '@hawkedge/types';

export const JWT_ALGORITHM = 'HS256';

export async function signAccessToken(
  payload: TokenPayload,
  secretString: string,
  expirationTime: string = '15m'
): Promise<string> {
  const secret = new TextEncoder().encode(secretString);
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secret);
}

export async function signRefreshToken(
  payload: { sub: string; sessionId: string },
  secretString: string,
  expirationTime: string = '7d'
): Promise<string> {
  const secret = new TextEncoder().encode(secretString);
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secret);
}

export async function verifyToken(
  token: string,
  secretString: string
): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(secretString);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [JWT_ALGORITHM],
    });
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function checkRankClearance(userRank: UserRank, requiredRanks: UserRank[]): boolean {
  if (requiredRanks.length === 0) return true;
  if (userRank === 'SUPER_ADMIN') return true;
  return requiredRanks.includes(userRank);
}
