"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { TaskForm } from "@/components/TaskForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/components/ToastProvider";
import { useTasks } from "@/hooks/useTasks";
import type { TaskInput } from "@/types/task";

export default function NewTaskPage() {
  const router = useRouter();
  const { addTask, isLoaded } = useTasks();
  const { showToast } = useToast();

  function handleCreateTask(input: TaskInput) {
    const newTask = addTask(input);
    showToast(`Task "${newTask.title}" created successfully!`, "success");
    router.push(`/tasks/${newTask.id}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--bg-gradient-start),_transparent_34rem),linear-gradient(180deg,_var(--bg-body)_0%,_var(--bg-gradient-end)_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <PageHeader
          backHref="/"
          backLabel="Back to all tasks"
          title="Add a new task"
          description="Capture the title, optional notes, due date, and priority. Your task will be saved immediately in localStorage on this device."
          actions={
            <div className="flex flex-wrap gap-3">
              <ThemeToggle />
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
              >
                View tasks
              </Link>
            </div>
          }
        />

        {isLoaded ? (
          <TaskForm submitLabel="Create task" onSubmit={handleCreateTask} />
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-400">
            Loading your task list...
          </div>
        )}
      </div>
    </main>
  );
}
