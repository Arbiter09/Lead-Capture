import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  return NextResponse.json({ received: body }, { status: 200 });
}
