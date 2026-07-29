"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { TASK_PRIORITIES, type Task, type TaskInput, type TaskPriority } from "@/types/task";

const STORAGE_KEY = "personal-task-tracker.tasks.v1";

function createId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && (TASK_PRIORITIES as readonly string[]).includes(value);
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeStoredTask(value: unknown): Task | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const title = asString(record.title).trim();

  if (!title) {
    return null;
  }

  const fallbackTimestamp = new Date().toISOString();
  const createdAt = asString(record.createdAt) || fallbackTimestamp;

  return {
    id: asString(record.id) || createId(),
    title,
    description: asString(record.description),
    dueDate: asString(record.dueDate),
    priority: isTaskPriority(record.priority) ? record.priority : "medium",
    completed: typeof record.completed === "boolean" ? record.completed : false,
    createdAt,
    updatedAt: asString(record.updatedAt) || createdAt,
  };
}

function readTasksFromStorage(): Task[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedTasks = window.localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return [];
    }

    const parsedTasks: unknown = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      console.error("[TaskStore] Corrupted data in localStorage — expected array, resetting.");
      return [];
    }

    return parsedTasks.map(normalizeStoredTask).filter((task): task is Task => Boolean(task));
  } catch (error) {
    console.error("[TaskStore] Failed to read tasks from localStorage:", error);
    return [];
  }
}

function writeTasksToStorage(tasks: Task[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    // Handle QuotaExceededError gracefully
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.error("[TaskStore] localStorage quota exceeded. Unable to save tasks. Consider deleting old tasks.");
    } else {
      console.error("[TaskStore] Failed to write tasks to localStorage:", error);
    }
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => {
      try {
        setTasks(readTasksFromStorage());
        setError(null);
      } catch (err) {
        console.error("[TaskStore] Initialization error:", err);
        setError("Failed to load tasks from storage.");
      } finally {
        setIsLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        try {
          setTasks(readTasksFromStorage());
          setError(null);
        } catch (err) {
          console.error("[TaskStore] Storage sync error:", err);
          setError("Failed to sync tasks from another tab.");
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setTasksAndPersist = useCallback((updater: (currentTasks: Task[]) => Task[]) => {
    setTasks((currentTasks) => {
      const nextTasks = updater(currentTasks);
      writeTasksToStorage(nextTasks);
      return nextTasks;
    });
  }, []);

  const addTask = useCallback(
    (input: TaskInput) => {
      const timestamp = new Date().toISOString();
      const newTask: Task = {
        id: createId(),
        title: input.title.trim(),
        description: input.description.trim(),
        dueDate: input.dueDate,
        priority: input.priority,
        completed: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      setTasksAndPersist((currentTasks) => [newTask, ...currentTasks]);
      return newTask;
    },
    [setTasksAndPersist],
  );

  const updateTask = useCallback(
    (taskId: string, input: TaskInput) => {
      setTasksAndPersist((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                title: input.title.trim(),
                description: input.description.trim(),
                dueDate: input.dueDate,
                priority: input.priority,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      );
    },
    [setTasksAndPersist],
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasksAndPersist((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    },
    [setTasksAndPersist],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      setTasksAndPersist((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      );
    },
    [setTasksAndPersist],
  );

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);
  const activeCount = tasks.length - completedCount;

  return {
    tasks,
    isLoaded,
    error,
    completedCount,
    activeCount,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}
