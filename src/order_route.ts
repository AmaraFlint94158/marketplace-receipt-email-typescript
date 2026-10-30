import { ZodError } from "zod";
import { InfraiError } from "./infrai.js";
import { sendReceipt } from "./receipt_sender.js";

export async function POST(request: Request): Promise<Response> {
  try { return Response.json({ message_id: (await sendReceipt(await request.json())).message_id }); }
  catch (error) {
    if (error instanceof ZodError) return Response.json({ error: "invalid order", details: error.issues }, { status: 400 });
    if (error instanceof InfraiError) return Response.json({ error: error.message }, { status: error.status >= 400 && error.status < 500 ? error.status : 502 });
    return Response.json({ error: "email request failed" }, { status: 500 });
  }
}
