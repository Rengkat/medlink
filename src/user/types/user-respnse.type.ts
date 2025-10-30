import { User } from '../entities/user.entity';

// Type for user without password and computed properties
export type UserWithoutPassword = Omit<
  User,
  'password' | 'fullName' | 'isVerificationTokenValid'
>;

// Type for user with computed properties as regular properties
export type UserResponse = UserWithoutPassword & {
  fullName?: string;
  isVerificationTokenValid?: boolean;
};
