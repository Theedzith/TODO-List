# 📋 Modern Task Tracker (Next.js 16 + TypeScript + Tailwind CSS)

A full-featured, responsive, and modern **Task Tracker / TODO Application** built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

- **📝 Task Management**: Create, edit, update, delete, and toggle completion status for tasks.
- **🎯 Priority Classification**: Categorize tasks by priority (**Low**, **Medium**, **High**) with visually distinct color badges.
- **📅 Due Dates & Deadlines**: Set and track completion deadlines for each task.
- **🔍 Real-time Search & Filtering**: 
  - Search tasks dynamically by title or description.
  - Filter tasks by status (**All**, **Active**, **Completed**).
- **🔀 Multi-Criterion Sorting**: Sort tasks by **Newest First**, **Due Date**, **Priority**, or **Title**.
- **🌙 Dark & Light Mode**: Seamless theme switching with system preference detection and persistent local preference.
- **🔔 Toast Notifications**: Interactive feedback toasts for operations (add, edit, delete, complete).
- **⚡ Next.js API Routes**: Built-in REST API endpoints (`/api/tasks`, `/api/tasks/[id]`, `/api/health`).
- **📱 Fully Responsive**: Crafted with modern UI components optimized for desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Components**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Icons**: Custom SVG Icons & Clean UI primitives

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Theedzith/TODO-List.git
   cd TODO-List
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with Turbopack |
| `npm run build` | Builds the optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code issues |
| `npm run typecheck` | Runs TypeScript compiler check (`tsc --noEmit`) |

---

## 📁 Project Structure

```text
build-nextjs-task-tracker/
├── src/
│   ├── app/
│   │   ├── api/          # Next.js API routes (/api/tasks, /api/health)
│   │   ├── tasks/        # Dynamic task routes (/tasks/new, /tasks/[id])
│   │   ├── globals.css   # Global styles and Tailwind configuration
│   │   ├── layout.tsx    # Root layout with Theme and Toast providers
│   │   └── page.tsx      # Main dashboard page with task list & filters
│   ├── components/       # Reusable UI components (TaskForm, ThemeToggle, etc.)
│   ├── hooks/            # Custom hooks (useTasks)
│   ├── lib/              # Utilities and storage helpers
│   └── types/            # TypeScript interfaces & types
├── public/               # Static assets
├── .gitignore            # Git ignore rules
├── next.config.ts        # Next.js configuration
├── package.json          # Package dependencies & scripts
└── tsconfig.json         # TypeScript configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Theedzith/TODO-List/issues).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
