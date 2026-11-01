/**
 * Production Paid Subscription Niche Newsletter Engine - Core Types
 * Category D: Content, Media & Audience (Product 78)
 * Standards: Modern Evidence-Based Clinical Informatics & Technical Architecture
 */

export type SubscriptionTier = 'free_reader' | 'pro_subscriber' | 'founding_member' | 'enterprise_tier';

export interface ResearchSourceItem {
  id: string;
  title: string;
  publicationOrSource: string;
  publishedDateIso: string;
  sourceUrl: string;
  evidenceStrength: 'clinical_trial' | 'peer_reviewed_paper' | 'regulatory_advisory' | 'benchmark_dataset';
  keyFindings: string[];
  clinicalOrTechnicalRelevance: string;
}

export interface ResearchDossier {
  dossierId: string;
  topicTitle: string;
  generatedDateIso: string;
  primaryThesis: string;
  sources: ResearchSourceItem[];
  executiveSummary: string;
  dataPoints: Array<{ metricName: string; value: string; benchmarkContext: string }>;
}

export interface NewsletterSection {
  sectionTitle: string;
  contentMarkdown: string;
  isSubscriberOnly: boolean;
}

export interface NewsletterDraft {
  editionId: string;
  editionNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  authorName: string;
  publishedDateIso: string;
  readingTimeMinutes: number;
  sections: NewsletterSection[];
  freeExcerptCutoffIndex: number; // Section index where paywall occurs
  citations: Array<{ referenceNumber: number; citationText: string; url: string }>;
}

export interface PaywallSplitResult {
  freePreviewHtml: string;
  fullContentHtml: string;
  paywallMarkerInserted: boolean;
  subscriberCtaBlockHtml: string;
  wordCountFree: number;
  wordCountTotal: number;
  previewPercentage: number;
}

export interface ArchiveSeoMetadata {
  editionId: string;
  slug: string;
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: 'article';
    publishedTime: string;
    authors: string[];
  };
  jsonLdArticleSchema: string;
}
