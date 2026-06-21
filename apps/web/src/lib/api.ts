import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export async function parseJson<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  const body = await request.json().catch(() => ({}));
  return schema.parse(body);
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Validation failed.", 422, error.flatten());
  }

  if (error instanceof Error && "status" in error && typeof error.status === "number") {
    const details = "details" in error ? error.details : undefined;
    return fail(error.message, error.status, details);
  }

  if (error instanceof Error) {
    return fail(error.message, 400);
  }

  return fail("Unexpected server error.", 500);
}

export function searchParams(request: Request) {
  return Object.fromEntries(new URL(request.url).searchParams.entries());
}
