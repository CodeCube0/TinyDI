export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export interface ITaskRepository {
  add(title: string): Task;
  list(): Task[];
}

export class InMemoryTaskRepository implements ITaskRepository {
  private readonly tasks: Task[] = [];
  private nextId = 1;

  add(title: string): Task {
    const task: Task = { id: String(this.nextId++), title, done: false };
    this.tasks.push(task);
    return task;
  }

  list(): Task[] {
    return [...this.tasks];
  }
}
