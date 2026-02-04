export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  lastLoginAt: Date;
  lastActiveAt: Date;
};
