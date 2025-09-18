import pool from "../database/pool.js";
import type {
  CreateTaskParams,
  Task,
  UpdateTaskParams,
} from "../model/Task.js";
import { TaskStatus, TaskPriority } from "../model/Task.js";

// Custom error classes for better error handling
export class TaskNotFoundError extends Error {
  constructor(message: string = "Task not found") {
    super(message);
    this.name = "TaskNotFoundError";
  }
}

export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export class TaskService {
  // Validation helper methods
  private static validateTaskData(data: CreateTaskParams): void {
    if (!data.title?.trim()) {
      throw new TaskValidationError("Title is required");
    }

    if (data.due_date !== undefined && data.due_date < new Date()) {
      throw new TaskValidationError("Due date cannot be in the past");
    }
  }

  private static sanitizeTaskData(
    data: Partial<CreateTaskParams>
  ): Partial<CreateTaskParams> {
    const sanitized: Partial<CreateTaskParams> = {};

    if (data.title) {
      sanitized.title = data.title.trim();
    }
    if (data.description !== undefined) {
      const trimmedDescription = data.description?.trim();
      if (trimmedDescription !== undefined) {
        sanitized.description = trimmedDescription;
      }
    }
    if (data.status !== undefined) {
      sanitized.status = data.status;
    }
    if (data.priority !== undefined) {
      sanitized.priority = data.priority;
    }
    if (data.due_date !== undefined) {
      sanitized.due_date = data.due_date;
    }

    return sanitized;
  }

  // Get all tasks with optional pagination
  static async getAllTasks(limit?: number, offset?: number): Promise<Task[]> {
    try {
      let query = "SELECT * FROM tasks ORDER BY created_at DESC";
      const params: any[] = [];

      if (limit !== undefined) {
        query += " LIMIT $1";
        params.push(limit);

        if (offset !== undefined) {
          query += " OFFSET $2";
          params.push(offset);
        }
      }

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  }

  // Get task by ID
  static async getTaskById(id: number): Promise<Task> {
    try {
      if (!id || id <= 0) {
        throw new TaskValidationError("Invalid task ID");
      }

      const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [
        id,
      ]);

      if (result.rows.length === 0) {
        throw new TaskNotFoundError(`Task with ID ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      if (
        error instanceof TaskNotFoundError ||
        error instanceof TaskValidationError
      ) {
        throw error;
      }
      console.error("Error fetching task by ID:", error);
      throw new Error("Failed to fetch task");
    }
  }

  // Get tasks by status
  static async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC",
        [status]
      );

      return result.rows;
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      throw new Error("Failed to fetch tasks");
    }
  }

  // Get tasks by priority
  static async getTasksByPriority(priority: TaskPriority): Promise<Task[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM tasks WHERE priority = $1 ORDER BY created_at DESC",
        [priority]
      );

      return result.rows;
    } catch (error) {
      console.error("Error fetching tasks by priority:", error);
      throw new Error("Failed to fetch tasks");
    }
  }

  // Search tasks by title or description
  static async searchTasks(searchTerm: string): Promise<Task[]> {
    try {
      if (!searchTerm?.trim()) {
        throw new TaskValidationError("Search term is required");
      }

      const searchPattern = `%${searchTerm.trim()}%`;
      const result = await pool.query(
        `SELECT * FROM tasks 
         WHERE LOWER(title) LIKE LOWER($1) 
         OR LOWER(description) LIKE LOWER($1)
         ORDER BY created_at DESC`,
        [searchPattern]
      );

      return result.rows;
    } catch (error) {
      if (error instanceof TaskValidationError) {
        throw error;
      }
      console.error("Error searching tasks:", error);
      throw new Error("Failed to search tasks");
    }
  }

  // Create new task
  static async createTask(taskData: CreateTaskParams): Promise<Task> {
    try {
      this.validateTaskData(taskData);
      const sanitizedData = this.sanitizeTaskData(taskData);

      const result = await pool.query(
        `INSERT INTO tasks (title, description, status, priority, due_date) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          sanitizedData.title,
          sanitizedData.description,
          sanitizedData.status || TaskStatus.PENDING,
          sanitizedData.priority || TaskPriority.MEDIUM,
          sanitizedData.due_date,
        ]
      );

      return result.rows[0];
    } catch (error) {
      if (error instanceof TaskValidationError) {
        throw error;
      }
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  }

  // Update task
  static async updateTask(
    id: number,
    taskData: UpdateTaskParams
  ): Promise<Task> {
    try {
      if (!id || id <= 0) {
        throw new TaskValidationError("Invalid task ID");
      }

      // Check if task exists
      await this.getTaskById(id);

      const sanitizedData = this.sanitizeTaskData(taskData);

      // Validate due date if provided
      if (
        sanitizedData.due_date !== undefined &&
        sanitizedData.due_date < new Date()
      ) {
        throw new TaskValidationError("Due date cannot be in the past");
      }

      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      // Build dynamic update query
      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (value !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new TaskValidationError("No valid fields to update");
      }

      // Add updated_at timestamp
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await pool.query(
        `UPDATE tasks SET ${fields.join(
          ", "
        )} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      return result.rows[0];
    } catch (error) {
      if (
        error instanceof TaskNotFoundError ||
        error instanceof TaskValidationError
      ) {
        throw error;
      }
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  }

  // Delete task
  static async deleteTask(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new TaskValidationError("Invalid task ID");
      }

      // Check if task exists
      await this.getTaskById(id);

      const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

      if (result.rowCount === 0) {
        throw new TaskNotFoundError(`Task with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof TaskNotFoundError ||
        error instanceof TaskValidationError
      ) {
        throw error;
      }
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  }

  // Get task count by status
  static async getTaskCountByStatus(): Promise<
    Array<{ status: string; count: number }>
  > {
    try {
      const result = await pool.query(
        `SELECT status, COUNT(*) as count 
         FROM tasks 
         GROUP BY status 
         ORDER BY count DESC`
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting task count by status:", error);
      throw new Error("Failed to get task statistics");
    }
  }

  // Get task count by priority
  static async getTaskCountByPriority(): Promise<
    Array<{ priority: string; count: number }>
  > {
    try {
      const result = await pool.query(
        `SELECT priority, COUNT(*) as count 
         FROM tasks 
         GROUP BY priority 
         ORDER BY count DESC`
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting task count by priority:", error);
      throw new Error("Failed to get task statistics");
    }
  }

  // Get total task count
  static async getTotalTaskCount(): Promise<number> {
    try {
      const result = await pool.query("SELECT COUNT(*) as count FROM tasks");
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error("Error getting total task count:", error);
      throw new Error("Failed to get task count");
    }
  }
}
