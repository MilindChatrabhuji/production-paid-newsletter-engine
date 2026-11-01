# Deployment & Operations Manual - Edge Subscription Gateway

## Prerequisites
* Node.js v18+ or v20+
* Cloudflare account with Workers & D1 enabled ($0.00 free tier)
* Wrangler CLI installed (`npx wrangler`)

## Step 1: Initialize Cloudflare D1 Database
```bash
cd engine/edge_subscription_gateway
npx wrangler d1 create production-newsletter-db
```
Copy the generated `database_id` into `wrangler.toml`.

## Step 2: Apply Database Schema
```bash
npx wrangler d1 execute production-newsletter-db --file=schema.sql
```

## Step 3: Deploy Worker to Global Edge
```bash
npx wrangler deploy
```

## Step 4: Webhook Configuration
* Configure your payment provider (Stripe, Razorpay, PayPal) to send webhook events to `https://<your-worker>.workers.dev/api/newsletter/webhook`.
* Integrate client frontends with `GET https://<your-worker>.workers.dev/api/newsletter/verify?token=<jwt>`.
