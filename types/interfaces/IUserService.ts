import { User, UserRole } from '../../types/index.ts';

export interface IUserService {
  createUser(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User>;
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(
    id: string,
    updates: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: UserRole): Promise<User[]>;
  authenticateUser(email: string, password: string): Promise<User | null>;
}
