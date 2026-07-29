export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatusFilter = "all" | "active" | "completed";
export type TaskSortMode = "created" | "dueDate" | "priority" | "title";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskInput = Pick<Task, "title" | "description" | "dueDate" | "priority">;

export const PRIORITY_META = {
  low: {
    label: "Low",
    rank: 1,
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dotClass: "bg-emerald-500",
  },
  medium: {
    label: "Medium",
    rank: 2,
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-200",
    dotClass: "bg-amber-500",
  },
  high: {
    label: "High",
    rank: 3,
    badgeClass: "bg-rose-50 text-rose-700 ring-rose-200",
    dotClass: "bg-rose-500",
  },
} satisfies Record<
  TaskPriority,
  {
    label: string;
    rank: number;
    badgeClass: string;
    dotClass: string;
  }
>;

export const STATUS_FILTERS: Array<{ label: string; value: TaskStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export const SORT_OPTIONS: Array<{ label: string; value: TaskSortMode }> = [
  { label: "Newest first", value: "created" },
  { label: "Due date", value: "dueDate" },
  { label: "Priority", value: "priority" },
  { label: "Title", value: "title" },
];
