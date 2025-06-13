import { UserModel } from '../models/UserModel.ts';
import { User, UserRole } from '../types/index.ts';
import { IUserService } from './interfaces/IUserService.ts';

export class UserService implements IUserService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async createUser(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    return await this.userModel.create(userData);
  }

  async getUser(id: string): Promise<User | null> {
    return await this.userModel.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findByEmail(email);
  }

  async updateUser(
    id: string,
    updates: Partial<Omit<User, 'id' | 'createdAt'>>,
  ): Promise<User | null> {
    return await this.userModel.update(id, updates);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userModel.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await this.userModel.findByRole(role);
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    // For this demo, we'll just check if the user exists
    // In a real application, you would implement proper password hashing and verification
    const user = await this.userModel.findByEmail(email);

    if (!user) {
      return null;
    }

    // Note: In a real application, you would:
    // 1. Hash the password using bcrypt or similar
    // 2. Compare the hashed password with the stored hash
    // 3. Return the user only if passwords match

    // For demo purposes, we'll assume authentication is successful if user exists
    return user;
  }
}
