import { Container, createToken } from 'tinydi';
import type { IUserRepository } from './user-repository.js';
import { UserRepository } from './user-repository.js';
import { UserService } from './user-service.js';

const UserRepositoryToken = createToken<IUserRepository>('UserRepository');
const UserServiceToken = createToken<UserService>('UserService');

const container = new Container();

// Composition root: this is the only place that knows the concrete
// implementation behind `IUserRepository`.
container.registerFactory(UserRepositoryToken, () => new UserRepository());

// `UserService` depends on `IUserRepository`, resolved through the same
// container passed into the factory — TinyDI never guesses this wiring for
// you, it's always one explicit line.
container.registerFactory(UserServiceToken, (c) => new UserService(c.resolve(UserRepositoryToken)));

const userService = container.resolve(UserServiceToken);

userService.register('1', 'Ada Lovelace', 'ada@example.com');
userService.register('2', 'Alan Turing', 'alan@example.com');

console.log('All users:', userService.listAll());
console.log('Profile for "1":', userService.getProfile('1'));
