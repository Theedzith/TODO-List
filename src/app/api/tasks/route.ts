import { validateTaskInput } from "@/lib/validation";

export async function GET() {
  return Response.json({
    message:
      "Tasks are stored in the browser's localStorage. Use the web UI to manage tasks, or POST to this endpoint to validate a task payload.",
    endpoints: {
      "GET /api/tasks": "This help message",
      "POST /api/tasks": "Validate a task payload (title, description, dueDate, priority)",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validateTaskInput(body);

    if (!result.valid) {
      return Response.json(
        { ok: false, errors: result.errors },
        { status: 400 },
      );
    }

    return Response.json({
      ok: true,
      message: "Payload is valid. Task creation is handled client-side via localStorage.",
      validated: result.data,
    });
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }
}
