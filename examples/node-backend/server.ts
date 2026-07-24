import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { createAppContainer, TaskServiceToken } from './container.js';
import type { TaskService } from './task-service.js';

const container = createAppContainer();

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(payload);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw.length > 0 ? JSON.parse(raw) : {};
}

const server = createServer((req, res) => {
  // Each incoming request resolves the same singleton `TaskService` —
  // resolving from `container` here is the only place this backend example
  // touches the DI container directly.
  const taskService = container.resolve(TaskServiceToken);

  void handleRequest(req, res, taskService).catch((error: unknown) => {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Internal error' });
  });
});

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  taskService: TaskService,
): Promise<void> {
  if (req.method === 'GET' && req.url === '/tasks') {
    sendJson(res, 200, taskService.listTasks());
    return;
  }

  if (req.method === 'POST' && req.url === '/tasks') {
    const body = (await readJsonBody(req)) as { title?: unknown };
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      sendJson(res, 400, { error: '"title" is required and must be a non-empty string' });
      return;
    }
    sendJson(res, 201, taskService.createTask(body.title));
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

const port = 3000;
server.listen(port, () => {
  console.log(`Node backend example listening on http://localhost:${port}`);
  console.log('Try:');
  console.log(`  curl http://localhost:${port}/tasks`);
  console.log(
    `  curl -X POST http://localhost:${port}/tasks -H "Content-Type: application/json" -d '{"title":"Write docs"}'`,
  );
});
