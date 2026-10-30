import { z } from "zod";
import { infrai } from "./infrai.js";

export const orderSchema = z.object({ orderId: z.string().min(1), buyerEmail: z.string().email(), buyerName: z.string().min(1), sellerName: z.string().min(1), items: z.array(z.object({ name: z.string().min(1), quantity: z.number().int().positive(), unitCents: z.number().int().nonnegative() })).min(1) });
export type Order = z.infer<typeof orderSchema>;

export function receiptHtml(order: Order): string {
  const total = order.items.reduce((sum, item) => sum + item.quantity * item.unitCents, 0);
  const rows = order.items.map(item => `<li>${item.quantity} x ${item.name} - $${(item.quantity * item.unitCents / 100).toFixed(2)}</li>`).join("");
  return `<h1>Thanks for your order, ${order.buyerName}</h1><p>Seller: ${order.sellerName}</p><ul>${rows}</ul><p>Total: <strong>$${(total / 100).toFixed(2)}</strong></p><p>Order ${order.orderId}</p>`;
}

export async function sendReceipt(input: unknown) {
  const order = orderSchema.parse(input);
  return infrai.email.send({ to: order.buyerEmail, subject: `Receipt for order ${order.orderId}`, html: receiptHtml(order) });
}
