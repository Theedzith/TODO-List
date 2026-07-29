"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/components/ToastProvider";
import { useTasks } from "@/hooks/useTasks";
import {
  PRIORITY_META,
  SORT_OPTIONS,
  STATUS_FILTERS,
  type Task,
  type TaskSortMode,
  type TaskStatusFilter,
} from "@/types/task";

function formatDueDate(dateString: string) {
  if (!dateString) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${task.dueDate}T00:00:00`) < today;
}

function sortTasks(tasks: Task[], sortMode: TaskSortMode) {
  return [...tasks].sort((firstTask, secondTask) => {
    if (sortMode === "dueDate") {
      if (!firstTask.dueDate && !secondTask.dueDate) {
        return Date.parse(secondTask.createdAt) - Date.parse(firstTask.createdAt);
      }

      if (!firstTask.dueDate) {
        return 1;
      }

      if (!secondTask.dueDate) {
        return -1;
      }

      return firstTask.dueDate.localeCompare(secondTask.dueDate);
    }

    if (sortMode === "priority") {
      return PRIORITY_META[secondTask.priority].rank - PRIORITY_META[firstTask.priority].rank;
    }

    if (sortMode === "title") {
      return firstTask.title.localeCompare(secondTask.title);
    }

    return Date.parse(secondTask.createdAt) - Date.parse(firstTask.createdAt);
  });
}

export default function HomePage() {
  const { tasks, isLoaded, completedCount, activeCount, toggleTask, deleteTask } = useTasks();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<TaskStatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<TaskSortMode>("created");

  const visibleTasks = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const filteredTasks = tasks.filter((task) => {
      const matchesStatus =
        filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed);
      const matchesSearch =
        !normalizedSearchTerm ||
        task.title.toLowerCase().includes(normalizedSearchTerm) ||
        task.description.toLowerCase().includes(normalizedSearchTerm);

      return matchesStatus && matchesSearch;
    });

    return sortTasks(filteredTasks, sortMode);
  }, [filter, searchTerm, sortMode, tasks]);

  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  function handleDelete(task: Task) {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      deleteTask(task.id);
      showToast(`Deleted task "${task.title}".`, "info");
    }
  }

  function handleToggle(task: Task) {
    toggleTask(task.id);
    showToast(
      task.completed
        ? `Marked "${task.title}" active.`
        : `Completed "${task.title}"! 🎉`,
      "success"
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--bg-gradient-start),_transparent_34rem),linear-gradient(180deg,_var(--bg-body)_0%,_var(--bg-gradient-end)_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PageHeader
          title="Plan, track, and finish your tasks."
          description="A small Next.js App Router todo app that stores everything in your browser with localStorage. Add tasks, set priorities, filter by status, and keep your list focused."
          actions={
            <div className="flex flex-wrap gap-3">
              <ThemeToggle />
              <Link
                href="/tasks/new"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:bg-indigo-600 dark:shadow-indigo-900/40 dark:hover:bg-indigo-500"
              >
                + New task
              </Link>
            </div>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800/85 dark:shadow-slate-900/40">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Total tasks</p>
            <p className="mt-2 text-4xl font-black text-slate-950 dark:text-white">{tasks.length}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800/85 dark:shadow-slate-900/40">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Active</p>
            <p className="mt-2 text-4xl font-black text-indigo-600 dark:text-indigo-400">{activeCount}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800/85 dark:shadow-slate-900/40">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Completed</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</p>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{completionPercent}% done</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-xl shadow-slate-200/70 md:p-5 dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-slate-900/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" aria-label="Filter tasks by status">
              {STATUS_FILTERS.map((statusFilter) => (
                <button
                  key={statusFilter.value}
                  type="button"
                  onClick={() => setFilter(statusFilter.value)}
                  aria-pressed={filter === statusFilter.value}
                  className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                    filter === statusFilter.value
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
                  }`}
                >
                  {statusFilter.label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem] lg:w-[34rem]">
              <label className="sr-only" htmlFor="task-search">
                Search tasks
              </label>
              <input
                id="task-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search title or description..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:bg-slate-800 dark:focus:ring-indigo-900"
              />

              <label className="sr-only" htmlFor="task-sort">
                Sort tasks
              </label>
              <select
                id="task-sort"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as TaskSortMode)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:bg-slate-800 dark:focus:ring-indigo-900"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4" aria-live="polite">
          {!isLoaded ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
              Loading your saved tasks...
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-indigo-200 bg-white/80 p-10 text-center shadow-lg shadow-slate-200/60 dark:border-indigo-800 dark:bg-slate-800/80 dark:shadow-slate-900/40">
              <p className="text-5xl" aria-hidden="true">
                📝
              </p>
              <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">No tasks found</h2>
              <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">
                {tasks.length === 0
                  ? "Create your first task to start tracking your work."
                  : "Try changing your filter, search term, or sort option."}
              </p>
              <Link
                href="/tasks/new"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:shadow-indigo-900/40"
              >
                Add a task
              </Link>
            </div>
          ) : (
            <>
              <p className="px-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Showing {visibleTasks.length} of {tasks.length} task{tasks.length === 1 ? "" : "s"}
              </p>
              <div className="grid gap-4">
                {visibleTasks.map((task) => {
                  const priority = PRIORITY_META[task.priority];
                  const overdue = isOverdue(task);

                  return (
                    <article
                      key={task.id}
                      className={`rounded-[2rem] border border-white/80 bg-white p-5 shadow-xl shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/40 dark:hover:shadow-slate-900/60 ${
                        task.completed ? "opacity-75" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <button
                            type="button"
                            onClick={() => handleToggle(task)}
                            aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                            className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black transition focus:outline-none focus:ring-4 ${
                              task.completed
                                ? "border-emerald-500 bg-emerald-500 text-white focus:ring-emerald-100 dark:focus:ring-emerald-900"
                                : "border-slate-300 bg-white text-transparent hover:border-indigo-500 focus:ring-indigo-100 dark:border-slate-500 dark:bg-slate-700 dark:hover:border-indigo-400 dark:focus:ring-indigo-900"
                            }`}
                          >
                            ✓
                          </button>

                          <div className="min-w-0">
                            <Link href={`/tasks/${task.id}`} className="group block">
                              <h2
                                className={`text-xl font-black tracking-tight text-slate-950 transition group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-400 ${
                                  task.completed ? "line-through decoration-2" : ""
                                }`}
                              >
                                {task.title}
                              </h2>
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                {task.description || "No description added yet."}
                              </p>
                            </Link>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1 ${priority.badgeClass}`}>
                                <span className={`h-2 w-2 rounded-full ${priority.dotClass}`} aria-hidden="true" />
                                {priority.label}
                              </span>
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${
                                  overdue
                                    ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800"
                                    : "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600"
                                }`}
                              >
                                {overdue ? "Overdue: " : "Due: "}
                                {formatDueDate(task.dueDate)}
                              </span>
                              {task.completed ? (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800">
                                  Completed
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2 md:pt-1">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(task)}
                            className="inline-flex items-center justify-center rounded-2xl border border-rose-100 px-4 py-2 text-sm font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:border-rose-700 dark:hover:bg-rose-950"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
