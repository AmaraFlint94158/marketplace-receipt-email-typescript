import { sendReceipt } from "./receipt_sender.js";
const to = process.env.DEMO_EMAIL_TO;
if (!to) throw new Error("DEMO_EMAIL_TO is required");
const result = await sendReceipt({ orderId: "ORD-1042", buyerEmail: to, buyerName: "Mina", sellerName: "Northwind Goods", items: [{ name: "Canvas tote", quantity: 1, unitCents: 2400 }, { name: "Sticker pack", quantity: 2, unitCents: 500 }] });
console.log(`receipt sent: ${result.message_id}`);
