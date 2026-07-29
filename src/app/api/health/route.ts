export async function GET() {
  return Response.json({
    ok: true,
    app: "personal-task-tracker",
    storage: "localStorage",
    timestamp: new Date().toISOString(),
  });
}
