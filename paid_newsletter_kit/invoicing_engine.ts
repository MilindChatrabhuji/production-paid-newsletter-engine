/**
 * Dual-Currency Newsletter & Retainer Invoicing Engine
 * Handles INR (UPI) and USD (PayPal) billing, GST calculation, and LUT compliance.
 */

export interface NewsletterInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  category: 'subscription' | 'sponsorship' | 'retainer';
}

export interface NewsletterInvoiceCalculation {
  invoiceId: string;
  currency: 'INR' | 'USD';
  items: NewsletterInvoiceItem[];
  subtotal: number;
  taxGstAmount: number;
  total: number;
  lutZeroRated: boolean;
  paymentInstructions: {
    method: 'UPI' | 'PayPal';
    coordinate: string;
    note: string;
  };
}

export class NewsletterInvoicingEngine {
  public generateInvoice(
    items: NewsletterInvoiceItem[],
    currency: 'INR' | 'USD',
    isInternationalClient: boolean
  ): NewsletterInvoiceCalculation {
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const invoiceId = `INV-NL-${Date.now().toString(36).toUpperCase()}`;

    let taxGstAmount = 0;
    let lutZeroRated = false;

    if (currency === 'INR' || !isInternationalClient) {
      taxGstAmount = Number((subtotal * 0.18).toFixed(2)); // 18% GST for domestic clients
    } else {
      lutZeroRated = true; // Export of service with LUT declaration (0% GST)
    }

    const total = Number((subtotal + taxGstAmount).toFixed(2));

    const paymentInstructions = currency === 'INR'
      ? {
          method: 'UPI' as const,
          coordinate: 'milind.chatrabhuji@okhdfcbank',
          note: 'Domestic UPI payment. Remit exact amount to milind.chatrabhuji@okhdfcbank.'
        }
      : {
          method: 'PayPal' as const,
          coordinate: 'milind.chatrabhuji@gmail.com',
          note: 'International PayPal payment in USD. Zero-rated service export under LUT.'
        };

    return {
      invoiceId,
      currency,
      items,
      subtotal,
      taxGstAmount,
      total,
      lutZeroRated,
      paymentInstructions
    };
  }
}
