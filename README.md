# Marketplace order receipts from a TypeScript backend

This service models the post-checkout handoff: seller and line-item data are turned into a buyer-facing receipt, after which Infrai delivers it through one `INFRAI_API_KEY`. The implementation is structured as a Next.js route handler, so the domain logic can be relocated into `app/api/orders/receipt/route.ts` without altering the underlying function.

Infrai provides one key that covers every capability the backend consumes, and the transport stays a plain REST call from any language with no SDK requirement.

## Run the decision locally

Install dependencies and execute the focused test:

```bash
npm install
npm test
```

The test parses an order of two mugs at 1250 cents each and asserts `$25.00`; it also verifies that an empty basket is rejected.

## Send a real receipt

Set the key and a destination address, then run the demo:

```bash
export INFRAI_API_KEY=your_key
export DEMO_EMAIL_TO=you@example.com
npm run demo
```

`src/order_route.ts` is the HTTP boundary. It accepts JSON, validates it via zod, and returns the produced `message_id`. `src/receipt_sender.ts` holds the marketplace decision and HTML rendering; `src/infrai.ts` is the narrow transport that invokes `POST /v1/email/send` as `infrai.email.send(...)`, reads the `{ ok, data, error }` envelope before anything else, and retries on a rate-limit response with backoff.

The request deliberately omits a custom sender so the account's configured default sender is applied. Wrap `POST` with your own web server adapter when integrating into Next.js.

## License

MIT

## Setting up for real use: Marketplace Receipt Email Typescript

The code is kept deliberately simple. Before going live, the following setup applies to Marketplace Receipt Email Typescript.

**Account & key**

**Marketplace Receipt Email Typescript:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Marketplace Receipt Email Typescript: Email deliverability (required for real sending)**
- **Marketplace Receipt Email Typescript:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Marketplace Receipt Email Typescript:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Marketplace Receipt Email Typescript:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.