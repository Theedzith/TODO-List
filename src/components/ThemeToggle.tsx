"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  function cycleTheme() {
    const order: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = order.indexOf(theme);
    const nextTheme = order[(currentIndex + 1) % order.length];
    setTheme(nextTheme);
  }

  const label =
    theme === "system"
      ? `System (${resolvedTheme})`
      : theme === "dark"
        ? "Dark"
        : "Light";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Current theme: ${label}. Click to switch.`}
      title={`Theme: ${label}`}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:bg-slate-700 dark:hover:text-indigo-300 dark:focus:ring-indigo-900"
    >
      <span className="text-lg" aria-hidden="true">
        {resolvedTheme === "dark" ? "🌙" : "☀️"}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
