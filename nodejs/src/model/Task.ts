export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface Task {
  id: number;
  title: string;
  description: string | undefined;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: Date | undefined;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskParams {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: Date;
}

export type UpdateTaskParams = Partial<CreateTaskParams>;
