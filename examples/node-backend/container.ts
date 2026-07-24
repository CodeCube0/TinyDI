import { Container, createToken } from 'tinydi-container';
import { ConsoleLogger, type ILogger } from './logger.js';
import { InMemoryTaskRepository, type ITaskRepository } from './task-repository.js';
import { TaskService } from './task-service.js';

export const LoggerToken = createToken<ILogger>('Logger');
export const TaskRepositoryToken = createToken<ITaskRepository>('TaskRepository');
export const TaskServiceToken = createToken<TaskService>('TaskService');

/**
 * The composition root: the only place in the app that knows which concrete
 * implementations back `ILogger`, `ITaskRepository` and how `TaskService` is
 * wired together.
 */
export function createAppContainer(): Container {
  const container = new Container();

  container.registerInstance(LoggerToken, new ConsoleLogger());
  container.registerFactory(TaskRepositoryToken, () => new InMemoryTaskRepository());
  container.registerFactory(
    TaskServiceToken,
    (c) => new TaskService(c.resolve(LoggerToken), c.resolve(TaskRepositoryToken)),
  );

  return container;
}
