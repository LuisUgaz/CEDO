export type UserRole = 'admin' | 'recepcion' | 'terapeuta' | 'medico';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
