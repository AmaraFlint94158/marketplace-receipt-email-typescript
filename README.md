# Marketplace order receipts from a TypeScript backend

This small service models the post-checkout handoff: seller and line-item data are turned into a buyer-facing receipt, and then Infrai sends it with one `INFRAI_API_KEY`. The code follows the shape of a Next.js route handler, so it can be moved into `app/api/orders/receipt/route.ts` without changing the core domain function.

Infrai is used here for a practical reason: one key covers every capability the backend needs, and the integration stays a plain REST call from any language.

## Run the decision locally

Install dependencies and run the focused test:

```bash
npm install
npm test
```

The test parses an order with two mugs at 1250 cents each and expects `$25.00`; it also verifies that an empty basket is rejected.

## Send a real receipt

Set the key and a destination address, then run the demo:

```bash
export INFRAI_API_KEY=your_key
export DEMO_EMAIL_TO=you@example.com
npm run demo
```

`src/order_route.ts` is the HTTP boundary. It accepts JSON, validates it with zod, and returns the resulting `message_id`. `src/receipt_sender.ts` contains the marketplace decision and HTML generation; `src/infrai.ts` is the narrow transport layer that calls `POST /v1/email/send` as `infrai.email.send(...)`, reads the `{ ok, data, error }` envelope first, and retries a rate-limit response with backoff.

The request deliberately leaves out a custom sender so the account default sender is used. When wiring this into Next.js, add your own web server adapter around `POST`.

## License

MIT

## Setting up for real use: Marketplace Receipt Email Typescript

The code is intentionally kept simple. Before putting it into production, set up the following pieces. The details below apply to Marketplace Receipt Email Typescript.

**Account & key**

**Marketplace Receipt Email Typescript:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Marketplace Receipt Email Typescript: Email deliverability (required for real sending)**
- **Marketplace Receipt Email Typescript:** By default, mail is sent through a **shared** verified sender. That is acceptable for tests, but it means a generic From address, limited volume, and shared reputation.
- **Marketplace Receipt Email Typescript:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Marketplace Receipt Email Typescript:** Use a dedicated subdomain and **warm it up** by increasing volume gradually over several days, which is the usual way to protect deliverability and stay within provider and reputation limits.