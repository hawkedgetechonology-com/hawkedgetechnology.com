export type UserRank = 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MENTOR' | 'TRAINER' | 'STUDENT' | 'CLIENT' | 'GUEST';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface UserSessionPayload {
  id: string;
  email: string;
  rank: UserRank;
  status: UserStatus;
}
export interface TokenPayload {
  sub: string;
  email: string;
  rank: UserRank;
  status: UserStatus;
  sessionId: string;
}
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserSessionPayload;
}
