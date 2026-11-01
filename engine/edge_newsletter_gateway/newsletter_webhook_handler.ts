/**
 * Newsletter Webhook Handler
 * Processes lifecycle subscription events from Stripe, Razorpay, or PayPal.
 */

export interface WebhookEventPayload {
  eventId: string;
  eventType: 'checkout.session.completed' | 'invoice.paid' | 'customer.subscription.deleted';
  customerEmail: string;
  tier: string;
  amount: number;
  currency: string;
  timestampIso: string;
}

export class NewsletterWebhookHandler {
  public parseAndValidateWebhook(payload: any): { valid: boolean; event?: WebhookEventPayload; error?: string } {
    if (!payload || !payload.eventType) {
      return { valid: false, error: 'Missing eventType' };
    }
    if (!payload.customerEmail) {
      return { valid: false, error: 'Missing customerEmail' };
    }

    const event: WebhookEventPayload = {
      eventId: payload.eventId || `evt-${Date.now().toString(36)}`,
      eventType: payload.eventType,
      customerEmail: payload.customerEmail,
      tier: payload.tier || 'pro_subscriber',
      amount: payload.amount || 9.00,
      currency: payload.currency || 'USD',
      timestampIso: payload.timestampIso || new Date().toISOString()
    };

    return { valid: true, event };
  }

  public generateD1UpsertQuery(event: WebhookEventPayload): { sql: string; params: (string | number)[] } {
    const status = event.eventType === 'customer.subscription.deleted' ? 'canceled' : 'active';
    const sql = `
      INSERT INTO newsletter_subscribers (email, tier, status, last_event_id, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        tier = excluded.tier,
        status = excluded.status,
        last_event_id = excluded.last_event_id,
        updated_at = excluded.updated_at;
    `;
    const params = [event.customerEmail, event.tier, status, event.eventId, event.timestampIso];
    return { sql, params };
  }
}
