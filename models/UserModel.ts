import { BaseModel } from '@/models/BaseModel.ts';
import { User, UserRole } from '@/types/index.ts';

export class UserModel extends BaseModel<User> {
  async findByEmail(email: string): Promise<User | null> {
    const allUsers = await this.findAll();
    return allUsers.find((user) => user.email === email) || null;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const allUsers = await this.findAll();
    return allUsers.filter((user) => user.role === role);
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    const allUsers = await this.findAll();
    const term = searchTerm.toLowerCase();
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }
}
