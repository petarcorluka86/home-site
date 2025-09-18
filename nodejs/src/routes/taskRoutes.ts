import express from "express";

import { TaskStatus, TaskPriority } from "../model/Task.js";
import {
  TaskNotFoundError,
  TaskService,
  TaskValidationError,
} from "../services/taskService.js";

const router = express.Router();

// Async handler wrapper to forward errors to global error handler
const asyncHandler =
  (fn: any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/tasks - Get all tasks with optional pagination
router.get(
  "/",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string)
      : undefined;
    const tasks = await TaskService.getAllTasks(limit, offset);
    res.json(tasks);
  })
);

// GET /api/tasks/:id - Get task by ID
router.get(
  "/:id",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id || "0");
    const task = await TaskService.getTaskById(id);
    res.json(task);
  })
);

// POST /api/tasks - Create new task
router.post(
  "/",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const taskData = req.body;
    const newTask = await TaskService.createTask(taskData);
    res.status(201).json(newTask);
  })
);

// PUT /api/tasks/:id - Update task
router.put(
  "/:id",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id || "0");
    const taskData = req.body;
    const updatedTask = await TaskService.updateTask(id, taskData);
    res.json(updatedTask);
  })
);

// DELETE /api/tasks/:id - Delete task by ID
router.delete(
  "/:id",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id || "0");
    await TaskService.deleteTask(id);
    res.status(204).send();
  })
);

// GET /api/tasks/status/:status - Get tasks by status
router.get(
  "/status/:status",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const status = req.params.status as TaskStatus;
    const tasks = await TaskService.getTasksByStatus(status);
    res.json(tasks);
  })
);

// GET /api/tasks/priority/:priority - Get tasks by priority
router.get(
  "/priority/:priority",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const priority = req.params.priority as TaskPriority;
    const tasks = await TaskService.getTasksByPriority(priority);
    res.json(tasks);
  })
);

// GET /api/tasks/search?q=term - Search tasks
router.get(
  "/search",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const searchTerm = req.query.q as string;
    if (!searchTerm) {
      res.status(400);
      throw new TaskValidationError("Search term is required");
    }
    const tasks = await TaskService.searchTasks(searchTerm);
    res.json(tasks);
  })
);

// GET /api/tasks/stats/count - Get total task count
router.get(
  "/stats/count",
  asyncHandler(async (_: express.Request, res: express.Response) => {
    const count = await TaskService.getTotalTaskCount();
    res.json({ total: count });
  })
);

// GET /api/tasks/stats/status - Get task count by status
router.get(
  "/stats/status",
  asyncHandler(async (_: express.Request, res: express.Response) => {
    const stats = await TaskService.getTaskCountByStatus();
    res.json(stats);
  })
);

// GET /api/tasks/stats/priority - Get task count by priority
router.get(
  "/stats/priority",
  asyncHandler(async (_: express.Request, res: express.Response) => {
    const stats = await TaskService.getTaskCountByPriority();
    res.json(stats);
  })
);

export default router;
