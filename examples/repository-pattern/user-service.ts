import type { User } from './user.js';
import type { IUserRepository } from './user-repository.js';

/**
 * Application-level logic sitting on top of `IUserRepository`. `UserService`
 * never talks to storage directly nor knows which `IUserRepository`
 * implementation it was given — that composition happens once, at the
 * container registration site.
 */
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  register(id: string, name: string, email: string): User {
    const user: User = { id, name, email };
    this.userRepository.add(user);
    return user;
  }

  getProfile(id: string): User {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new Error(`No user found with id "${id}"`);
    }
    return user;
  }

  listAll(): User[] {
    return this.userRepository.list();
  }
}
