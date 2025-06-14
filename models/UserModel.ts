import { MemcachedAdapter } from '@/database/MemcachedAdapter.ts';
import { MemcachedBaseModel } from '@/models/MemcachedBaseModel.ts';
import { User, UserRole } from '@/types/index.ts';

export class UserModel extends MemcachedBaseModel<User> {
  constructor(db: MemcachedAdapter) {
    super(db, 'users');
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOneByField('email', email);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return await this.findByField('role', role);
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    const term = searchTerm.toLowerCase();
    return await this.search((user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }
}
