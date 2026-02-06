export type RoleName = 'admin' | 'editor' | 'viewer';

export interface AuthState {
  userId: string;
  role: RoleName;
}
