import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ webhookId: string }>;
}

async function parseBody(request: NextRequest): Promise<unknown> {
  const text = await request.text();
  try {
    return { raw: text, parsed: JSON.parse(text) };
  } catch {
    return { raw: text, parsed: text };
  }
}

function verifySignature(payload: string, secret: string, signature: string): boolean {
  const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(signature, "utf8");
  return (
    expectedBuf.length === receivedBuf.length &&
    timingSafeEqual(expectedBuf, receivedBuf)
  );
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { webhookId } = await params;

  const webhook = await prisma.webhook.findUnique({
    where: { id: webhookId },
  });

  if (!webhook) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }

  const body = await parseBody(request);
  const rawBody = (body as { raw: string }).raw;
  const parsedBody = (body as { parsed: unknown }).parsed;

  const signature = request.headers.get("x-webhook-signature");
  if (signature) {
    if (!verifySignature(rawBody, webhook.secret, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  await inngest.send({
    name: "workflow/execute.workflow",
    data: {
      workflowId: webhook.workflowId,
      initialData: { webhookPayload: parsedBody, webhookId },
    },
  });

  return NextResponse.json({
    success: true,
    workflowId: webhook.workflowId,
  });
}
