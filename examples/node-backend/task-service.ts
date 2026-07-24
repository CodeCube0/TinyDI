import type { ILogger } from './logger.js';
import type { ITaskRepository, Task } from './task-repository.js';

/**
 * The application/service layer: coordinates the repository and the logger.
 * It depends on both only through their interfaces.
 */
export class TaskService {
  constructor(
    private readonly logger: ILogger,
    private readonly taskRepository: ITaskRepository,
  ) {}

  createTask(title: string): Task {
    const task = this.taskRepository.add(title);
    this.logger.info(`Created task "${task.title}" (id ${task.id})`);
    return task;
  }

  listTasks(): Task[] {
    return this.taskRepository.list();
  }
}
