import type { User } from './user.js';

export interface IUserRepository {
  findById(id: string): User | undefined;
  add(user: User): void;
  list(): User[];
}

/**
 * A repository backed by an in-memory array. In a real application this
 * would be swapped for one that talks to a database, without changing
 * anything in `UserService`, which only depends on `IUserRepository`.
 */
export class UserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  add(user: User): void {
    this.users.set(user.id, user);
  }

  list(): User[] {
    return [...this.users.values()];
  }
}
