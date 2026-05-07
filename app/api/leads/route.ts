import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { leadSchema, type LeadInput } from "@/lib/validations";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { error: dbError } = await supabaseServer
    .from("leads")
    .insert(parsed.data);

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }
    console.error("[leads] Supabase insert error:", dbError);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  waitUntil(fireWebhook(parsed.data));
  return NextResponse.json({ success: true }, { status: 201 });
}

async function fireWebhook(data: LeadInput): Promise<void> {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[webhook] WEBHOOK_URL env var is not set");
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Candidate-Name": "Jas Shah",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(
        `[webhook] non-2xx response: ${res.status} ${res.statusText}`
      );
    }
  } catch (err) {
    console.error("[webhook] network failure:", err);
  }
}
