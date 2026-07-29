"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  validateTaskInput,
  type FieldErrors,
} from "@/lib/validation";
import { PRIORITY_META, TASK_PRIORITIES, type Task, type TaskInput, type TaskPriority } from "@/types/task";

type TaskFormProps = {
  initialTask?: Task;
  submitLabel: string;
  onSubmit: (input: TaskInput) => void;
  cancelHref?: string;
};

export function TaskForm({ initialTask, submitLabel, onSubmit, cancelHref = "/" }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? "");
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? "medium");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateTaskInput({ title, description, dueDate, priority });

    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/40">
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="title" className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Title <span className="text-rose-500">*</span>
          </label>
          <span className={`text-xs font-semibold ${title.length > MAX_TITLE_LENGTH ? "text-rose-500" : "text-slate-400 dark:text-slate-500"}`}>
            {title.length}/{MAX_TITLE_LENGTH}
          </span>
        </div>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="e.g. Finish Next.js assignment"
          className={`mt-2 w-full rounded-2xl border bg-slate-50 px-4 py-3 text-base font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-slate-800 ${
            errors.title
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-600 dark:focus:ring-rose-900"
              : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
          }`}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title ? (
          <p id="title-error" className="mt-2 text-sm font-semibold text-rose-600 dark:text-rose-400" role="alert">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="description" className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Description
          </label>
          <span className={`text-xs font-semibold ${description.length > MAX_DESCRIPTION_LENGTH ? "text-rose-500" : "text-slate-400 dark:text-slate-500"}`}>
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          placeholder="Add notes, links, or context for this task."
          rows={5}
          className={`mt-2 w-full resize-y rounded-2xl border bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-slate-800 ${
            errors.description
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-600 dark:focus:ring-rose-900"
              : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
          }`}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description ? (
          <p id="description-error" className="mt-2 text-sm font-semibold text-rose-600 dark:text-rose-400" role="alert">
            {errors.description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.15fr]">
        <div>
          <label htmlFor="dueDate" className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Due date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => {
              setDueDate(event.target.value);
              if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
            }}
            className={`mt-2 w-full rounded-2xl border bg-slate-50 px-4 py-3 text-base font-semibold text-slate-950 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-800 ${
              errors.dueDate
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-600 dark:focus:ring-rose-900"
                : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
            }`}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
          />
          {errors.dueDate ? (
            <p id="dueDate-error" className="mt-2 text-sm font-semibold text-rose-600 dark:text-rose-400" role="alert">
              {errors.dueDate}
            </p>
          ) : null}
        </div>

        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Priority</legend>
          <div className="mt-2 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-700">
            {TASK_PRIORITIES.map((taskPriority) => {
              const isSelected = priority === taskPriority;
              const meta = PRIORITY_META[taskPriority];

              return (
                <label
                  key={taskPriority}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                    isSelected
                      ? "bg-white text-slate-950 shadow-sm dark:bg-slate-600 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={taskPriority}
                    checked={isSelected}
                    onChange={(event) => setPriority(event.target.value as TaskPriority)}
                    className="sr-only"
                  />
                  <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
                  {meta.label}
                </label>
              );
            })}
          </div>
          {errors.priority ? (
            <p className="mt-2 text-sm font-semibold text-rose-600 dark:text-rose-400" role="alert">
              {errors.priority}
            </p>
          ) : null}
        </fieldset>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:shadow-indigo-900/40 dark:focus:ring-indigo-900"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
