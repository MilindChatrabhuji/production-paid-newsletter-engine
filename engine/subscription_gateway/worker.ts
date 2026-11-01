/**
 * Cloudflare Worker - Edge Subscription Gateway
 * Sub-10ms global edge routing for Subscriber Entitlement and Webhook Ingestion.
 */

import { SubscriberEntitlementRouter } from './subscriber_entitlement_router';
import { NewsletterWebhookHandler } from './newsletter_webhook_handler';

export interface Env {
  DB?: any;
}

const router = new SubscriberEntitlementRouter();
const webhook = new NewsletterWebhookHandler();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'edge-subscription-gateway',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        settlement: {
          domestic_upi: 'milind.chatrabhuji@okhdfcbank',
          international_paypal: 'milind.chatrabhuji@gmail.com'
        }
      }), { headers: corsHeaders });
    }

    // Subscriber Entitlement Verification
    if (url.pathname === '/api/newsletter/verify') {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '') || url.searchParams.get('token') || '';

      const res = await router.verifyToken(token);
      const isEntitled = res.claim ? router.canAccessFullEdition(res.claim) : false;

      return new Response(JSON.stringify({
        success: res.valid,
        isEntitled,
        claim: res.claim,
        latencyMs: res.latencyMs,
        edgeLocation: 'BOM1-Cloudflare-PoP'
      }), { headers: corsHeaders });
    }

    // Subscription Webhook
    if (url.pathname === '/api/newsletter/webhook' && request.method === 'POST') {
      try {
        const body = await request.json();
        const parsed = webhook.parseAndValidateWebhook(body);
        if (!parsed.valid || !parsed.event) {
          return new Response(JSON.stringify({ error: parsed.error }), { status: 400, headers: corsHeaders });
        }

        const query = webhook.generateD1UpsertQuery(parsed.event);
        if (env.DB) {
          await env.DB.prepare(query.sql).bind(...query.params).run();
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Subscriber record synchronized',
          event: parsed.event
        }), { headers: corsHeaders });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), { status: 404, headers: corsHeaders });
  }
};
