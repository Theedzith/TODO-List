"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TaskForm } from "@/components/TaskForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/components/ToastProvider";
import { useTasks } from "@/hooks/useTasks";
import { PRIORITY_META, type Task, type TaskInput } from "@/types/task";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDueDate(task: Task) {
  if (!task.dueDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${task.dueDate}T00:00:00`));
}

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { tasks, isLoaded, updateTask, deleteTask, toggleTask } = useTasks();
  const { showToast } = useToast();
  const [notice, setNotice] = useState("");
  const task = tasks.find((savedTask) => savedTask.id === params.id);

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--bg-gradient-start),_transparent_34rem),linear-gradient(180deg,_var(--bg-body)_0%,_var(--bg-gradient-end)_100%)] px-4 py-8 md:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
          Loading task details...
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--bg-gradient-start),_transparent_34rem),linear-gradient(180deg,_var(--bg-body)_0%,_var(--bg-gradient-end)_100%)] px-4 py-8 md:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <PageHeader
            backHref="/"
            backLabel="Back to all tasks"
            title="Task not found"
            description="This task may have been deleted, or it may only exist in another browser or device because this app uses localStorage."
            actions={
              <div className="flex flex-wrap gap-3">
                <ThemeToggle />
                <Link
                  href="/tasks/new"
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:shadow-indigo-900/40"
                >
                  Create a task
                </Link>
              </div>
            }
          />
        </div>
      </main>
    );
  }

  const currentTask = task;
  const priority = PRIORITY_META[currentTask.priority];

  function handleUpdateTask(input: TaskInput) {
    updateTask(currentTask.id, input);
    setNotice("Task changes saved locally.");
    showToast("Task updated successfully!", "success");
  }

  function handleDeleteTask() {
    if (window.confirm(`Delete "${currentTask.title}"? This cannot be undone.`)) {
      deleteTask(currentTask.id);
      showToast(`Deleted task "${currentTask.title}".`, "info");
      router.push("/");
    }
  }

  function handleToggleTask() {
    toggleTask(currentTask.id);
    const message = currentTask.completed ? "Task marked active again." : "Task marked complete!";
    setNotice(message);
    showToast(message, "success");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--bg-gradient-start),_transparent_34rem),linear-gradient(180deg,_var(--bg-body)_0%,_var(--bg-gradient-end)_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <PageHeader
          backHref="/"
          backLabel="Back to all tasks"
          title="Task details"
          description="Edit the task, toggle completion, or delete it from your browser storage."
          actions={
            <div className="flex flex-wrap gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleToggleTask}
                className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${
                  currentTask.completed
                    ? "bg-slate-950 text-white shadow-slate-300 focus:ring-slate-200 dark:bg-slate-200 dark:text-slate-900 dark:shadow-slate-900/40 dark:focus:ring-slate-700"
                    : "bg-emerald-600 text-white shadow-emerald-200 focus:ring-emerald-100 dark:shadow-emerald-900/40 dark:focus:ring-emerald-900"
                }`}
              >
                {currentTask.completed ? "Mark incomplete" : "Mark complete"}
              </button>
            </div>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800/85 dark:shadow-slate-900/40">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Status</p>
            <p className={`mt-2 text-2xl font-black ${currentTask.completed ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"}`}>
              {currentTask.completed ? "Completed" : "Active"}
            </p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800/85 dark:shadow-slate-900/40">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Priority</p>
            <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-black ring-1 ${priority.badgeClass}`}>
              <span className={`h-2 w-2 rounded-full ${priority.dotClass}`} aria-hidden="true" />
              {priority.label}
            </p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800/85 dark:shadow-slate-900/40">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Due</p>
            <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{formatDueDate(currentTask)}</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/40">
          <h2 className={`text-3xl font-black tracking-tight text-slate-950 dark:text-white ${currentTask.completed ? "line-through decoration-2" : ""}`}>
            {currentTask.title}
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-slate-600 dark:text-slate-400">
            {currentTask.description || "No description added for this task."}
          </p>
          <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 text-sm font-semibold text-slate-500 sm:grid-cols-2 dark:border-slate-700 dark:text-slate-400">
            <p>Created: {formatDateTime(currentTask.createdAt)}</p>
            <p>Updated: {formatDateTime(currentTask.updatedAt)}</p>
          </div>
        </section>

        {notice ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" role="status">
            {notice}
          </p>
        ) : null}

        <TaskForm key={`${currentTask.id}-${currentTask.updatedAt}`} initialTask={currentTask} submitLabel="Save changes" onSubmit={handleUpdateTask} />

        <section className="rounded-[2rem] border border-rose-100 bg-rose-50/80 p-6 shadow-lg shadow-rose-100/50 dark:border-rose-900 dark:bg-rose-950/50 dark:shadow-rose-900/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-rose-950 dark:text-rose-200">Danger zone</h2>
              <p className="mt-1 text-sm text-rose-700 dark:text-rose-400">Deleting a task removes it from localStorage immediately.</p>
            </div>
            <button
              type="button"
              onClick={handleDeleteTask}
              className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100 dark:shadow-rose-900/40 dark:focus:ring-rose-900"
            >
              Delete task
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
