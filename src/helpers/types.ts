export interface User {
  id: string;
  email: string;
  role: string;
  created_at: Date;
  isPasswordChanged: boolean;
}
