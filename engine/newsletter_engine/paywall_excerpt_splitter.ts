import { NewsletterDraft, PaywallSplitResult } from './types';

export class PaywallExcerptSplitter {
  public splitPaywall(draft: NewsletterDraft): PaywallSplitResult {
    let freeMarkdown = '';
    let fullMarkdown = '';
    let wordCountFree = 0;
    let wordCountTotal = 0;

    for (let i = 0; i < draft.sections.length; i++) {
      const sec = draft.sections[i];
      const sectionHeader = `## ${sec.sectionTitle}\n\n`;
      const sectionBody = `${sec.contentMarkdown}\n\n`;
      const words = (sectionHeader + sectionBody).trim().split(/\s+/).length;

      wordCountTotal += words;
      fullMarkdown += sectionHeader + sectionBody;

      if (i < draft.freeExcerptCutoffIndex) {
        freeMarkdown += sectionHeader + sectionBody;
        wordCountFree += words;
      }
    }

    const previewPercentage = Math.round((wordCountFree / wordCountTotal) * 100);

    const subscriberCtaBlockHtml = `
<div class="subscriber-paywall-barrier" style="background:#1E293B; border:2px solid #8B5CF6; border-radius:12px; padding:24px; text-align:center; margin:32px 0;">
  <div style="font-size:24px; margin-bottom:8px;">🔒</div>
  <h3 style="color:#F8FAFC; margin-bottom:8px; font-size:20px;">You have reached the subscriber-only analysis</h3>
  <p style="color:#94A3B8; max-width:540px; margin:0 auto 20px auto; font-size:14px;">
    Unlock the full architectural blueprint, complete TypeScript code labs, and tactical implementation playbooks by upgrading to Pro Subscriber ($9/mo) or Founding Member.
  </p>
  <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
    <a href="https://newsletter.example.com/subscribe?tier=pro" style="background:#8B5CF6; color:#FFFFFF; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:700; font-size:14px;">
      Unlock Pro Edition ($9 / mo)
    </a>
    <a href="https://newsletter.example.com/subscribe?tier=founding" style="background:#F59E0B; color:#0F172A; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:700; font-size:14px;">
      Join Founding Cohort ($19 / bundle)
    </a>
  </div>
  <div style="margin-top:16px; font-size:12px; color:#64748B;">
    Domestic settlement via UPI: <code>milind.chatrabhuji@okhdfcbank</code> | International via PayPal: <code>milind.chatrabhuji@gmail.com</code>
  </div>
</div>`;

    const freePreviewHtml = `<div class="newsletter-free-preview">${this.markdownToSimpleHtml(freeMarkdown)}</div>\n${subscriberCtaBlockHtml}`;
    const fullContentHtml = `<div class="newsletter-full-edition">${this.markdownToSimpleHtml(fullMarkdown)}</div>`;

    return {
      freePreviewHtml,
      fullContentHtml,
      paywallMarkerInserted: true,
      subscriberCtaBlockHtml,
      wordCountFree,
      wordCountTotal,
      previewPercentage
    };
  }

  private markdownToSimpleHtml(md: string): string {
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^<p><\/p>/, '');
  }
}
