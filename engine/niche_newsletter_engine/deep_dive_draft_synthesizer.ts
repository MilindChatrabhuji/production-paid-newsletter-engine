import { ResearchDossier, NewsletterDraft, NewsletterSection } from './types';

export class DeepDiveDraftSynthesizer {
  public synthesizeDraft(
    editionNumber: number,
    dossier: ResearchDossier,
    authorName: string = 'Dr. Milind Chatrabhuji'
  ): NewsletterDraft {
    const slug = `edition-${editionNumber}-${dossier.topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, '');
    const editionId = `ed-${editionNumber}-${Date.now().toString(36)}`;
    const publishedDateIso = new Date().toISOString();

    const sections: NewsletterSection[] = [
      {
        sectionTitle: 'Executive Summary & The Big Idea',
        contentMarkdown: `${dossier.executiveSummary}\n\nIn this edition, we break down why traditional monolithic architectures are failing under modern clinical telemetry loads, and how serverless edge entitlement solves both latency and compliance overhead.`,
        isSubscriberOnly: false
      },
      {
        sectionTitle: 'Clinical & Technical Benchmark Analysis',
        contentMarkdown: `### Empirical Evidence Breakdown\n\nOur examination of peer-reviewed sources reveals clear performance divergences:\n\n${dossier.dataPoints.map(dp => `* **${dp.metricName}**: ${dp.value} (*Context: ${dp.benchmarkContext}*)`).join('\n')}`,
        isSubscriberOnly: false
      },
      {
        sectionTitle: 'The Deep Architecture: Sub-10ms Edge Pipelines',
        contentMarkdown: `### Advanced Architectural Blueprint\n\nDeploying global Cloudflare Workers edge nodes combined with SQLite D1 serverless datastores eliminates the traditional database bottleneck. By validating JWT subscriber claims directly at the edge point of presence (PoP), response round-trips drop from ~180ms to <10ms.\n\n\`\`\`typescript\n// Edge JWT Validation Sample\nconst token = request.headers.get("Authorization");\nconst isValid = await verifySub10msEdgeToken(token);\nif (!isValid) return new Response("Subscriber Entitlement Required", { status: 403 });\n\`\`\``,
        isSubscriberOnly: true
      },
      {
        sectionTitle: 'Tactical Playbook & Executive Action Steps',
        contentMarkdown: `### 4-Step Production Implementation Guide\n\n1. **Step 1:** Establish RFC 2606 compliant staging environments.\n2. **Step 2:** Provision Cloudflare D1 distributed databases for entitlement records.\n3. **Step 3:** Implement dual-currency remittance routing for domestic UPI and international PayPal.\n4. **Step 4:** Execute automated weekly digest syndication with zero out-of-pocket overhead.`,
        isSubscriberOnly: true
      }
    ];

    const citations = dossier.sources.map((s, index) => ({
      referenceNumber: index + 1,
      citationText: `${s.title} (${s.publicationOrSource}, ${new Date(s.publishedDateIso).getFullYear()})`,
      url: s.sourceUrl
    }));

    return {
      editionId,
      editionNumber,
      slug,
      title: dossier.topicTitle,
      subtitle: `Evidence-based deep dive into ${dossier.primaryThesis}`,
      authorName,
      publishedDateIso,
      readingTimeMinutes: 7,
      sections,
      freeExcerptCutoffIndex: 2, // Sections 0 and 1 are free; Section 2+ are gated
      citations
    };
  }
}
