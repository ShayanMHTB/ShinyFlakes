interface User {
  id: number;
  email: string;
  fullName: string;
  createdAt?: string;
}

interface AuthToken {
  type: string;
  value: string;
}

interface LoginResponse {
  message: string;
  user: User;
  token: AuthToken;
}

interface RegisterResponse {
  message: string;
  user: User;
}

interface MeResponse {
  user: User;
}
