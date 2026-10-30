import assert from "node:assert/strict";
import { receiptHtml, orderSchema } from "./receipt_sender.js";
const order = orderSchema.parse({ orderId: "T-1", buyerEmail: "buyer@example.com", buyerName: "Jo", sellerName: "Shop", items: [{ name: "Mug", quantity: 2, unitCents: 1250 }] });
assert.match(receiptHtml(order), /Total: <strong>\$25\.00<\/strong>/);
assert.throws(() => orderSchema.parse({ ...order, items: [] }));
console.log("receipt decision test passed");
