import { NextRequest } from "next/server";
import { validateTaskInput } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  return Response.json({
    message: `Task ${id} is stored in the browser's localStorage. Use the web UI at /tasks/${id} to view or edit it.`,
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const result = validateTaskInput(body);

    if (!result.valid) {
      return Response.json(
        { ok: false, taskId: id, errors: result.errors },
        { status: 400 },
      );
    }

    return Response.json({
      ok: true,
      taskId: id,
      message: "Payload is valid. Task updates are handled client-side via localStorage.",
      validated: result.data,
    });
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  return Response.json({
    ok: true,
    taskId: id,
    message: "Task deletion is handled client-side via localStorage.",
  });
}
