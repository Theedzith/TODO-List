import { TASK_PRIORITIES, type TaskInput, type TaskPriority } from "@/types/task";

export type FieldErrors = Partial<Record<keyof TaskInput, string>>;

export type ValidationResult =
  | { valid: true; data: TaskInput }
  | { valid: false; errors: FieldErrors };

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

export function validateTitle(title: unknown): string | null {
  if (typeof title !== "string" || !title.trim()) {
    return "Title is required.";
  }

  if (title.trim().length > MAX_TITLE_LENGTH) {
    return `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  }

  return null;
}

export function validateDescription(description: unknown): string | null {
  if (typeof description === "string" && description.trim().length > MAX_DESCRIPTION_LENGTH) {
    return `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`;
  }

  return null;
}

export function validateDueDate(dueDate: unknown): string | null {
  if (!dueDate || (typeof dueDate === "string" && !dueDate.trim())) {
    return null; // optional
  }

  if (typeof dueDate !== "string") {
    return "Invalid date format.";
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dueDate)) {
    return "Date must be in YYYY-MM-DD format.";
  }

  const parsed = new Date(`${dueDate}T00:00:00`);
  if (isNaN(parsed.getTime())) {
    return "Invalid date.";
  }

  return null;
}

export function validatePriority(priority: unknown): string | null {
  if (!priority || typeof priority !== "string") {
    return "Priority is required.";
  }

  if (!(TASK_PRIORITIES as readonly string[]).includes(priority)) {
    return `Priority must be one of: ${TASK_PRIORITIES.join(", ")}.`;
  }

  return null;
}

export function validateTaskInput(input: Record<string, unknown>): ValidationResult {
  const errors: FieldErrors = {};

  const titleError = validateTitle(input.title);
  if (titleError) errors.title = titleError;

  const descriptionError = validateDescription(input.description);
  if (descriptionError) errors.description = descriptionError;

  const dueDateError = validateDueDate(input.dueDate);
  if (dueDateError) errors.dueDate = dueDateError;

  const priorityError = validatePriority(input.priority);
  if (priorityError) errors.priority = priorityError;

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title: (input.title as string).trim(),
      description: typeof input.description === "string" ? input.description.trim() : "",
      dueDate: typeof input.dueDate === "string" ? input.dueDate : "",
      priority: input.priority as TaskPriority,
    },
  };
}

export { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH };
