"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
}

type UseTasksResult = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  // Convenience: formatted task labels like in the existing UI
  labels: string[];
};

const DEFAULT_API_BASE = "http://localhost:8000";

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${apiBase}/api/tasks`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) {
        const message = `Failed to fetch tasks (${res.status})`;
        throw new Error(message);
      }
      const data = (await res.json()) as Task[];
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (err && typeof err === "object" && "message" in err) {
        setError(String((err as { message?: unknown }).message));
      } else {
        setError("Unknown error fetching tasks");
      }
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    fetchTasks();
    return () => abortRef.current?.abort();
  }, [fetchTasks]);

  const labels = useMemo(() => {
    return tasks.map((task) => {
      let prefix = "";
      switch (task.status) {
        case TaskStatus.COMPLETED:
          prefix = "✅ ";
          break;
        case TaskStatus.IN_PROGRESS:
          prefix = "⌛ ";
          break;
        case TaskStatus.CANCELLED:
          prefix = "❌ ";
          break;
        case TaskStatus.PENDING:
        default:
          prefix = "⏳ ";
          break;
      }
      return `${prefix} ${task.status} - ${task.title} `;
    });
  }, [tasks]);

  return { tasks, loading, error, refetch: fetchTasks, labels };
}

export default useTasks;
