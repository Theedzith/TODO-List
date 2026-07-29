import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function PageHeader({
  eyebrow = "Personal task tracker",
  title,
  description,
  actions,
  backHref,
  backLabel = "Back",
}: PageHeaderProps) {
  return (
    <header className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur md:p-8 dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-slate-900/40">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <span aria-hidden="true">←</span>
          {backLabel}
        </Link>
      ) : null}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-6xl dark:text-white">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg dark:text-slate-400">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
