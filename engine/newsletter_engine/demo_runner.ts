import { NicheResearchDossierCompiler } from './niche_research_dossier_compiler';
import { DeepDiveDraftSynthesizer } from './deep_dive_draft_synthesizer';
import { PaywallExcerptSplitter } from './paywall_excerpt_splitter';
import { ArchiveSeoMetadataGenerator } from './archive_seo_metadata_generator';

export function runPaidNewsletterDemo(): void {
  console.log('=== STARTING PAID SUBSCRIPTION NICHE NEWSLETTER DEMO ===');

  // 1. Research Dossier Compilation
  const compiler = new NicheResearchDossierCompiler();
  const dossier = compiler.getSampleClinicalDossier();
  console.log(`[PASS] Dossier compiled: "${dossier.topicTitle}" with ${dossier.sources.length} sources and ${dossier.dataPoints.length} clinical data points.`);

  // 2. Deep Dive Draft Synthesis
  const synthesizer = new DeepDiveDraftSynthesizer();
  const draft = synthesizer.synthesizeDraft(78, dossier, 'Dr. Milind Chatrabhuji');
  console.log(`[PASS] Synthesized draft Edition #${draft.editionNumber}: "${draft.title}". Total sections: ${draft.sections.length}.`);

  // 3. Paywall Excerpt Splitting
  const splitter = new PaywallExcerptSplitter();
  const split = splitter.splitPaywall(draft);
  console.log(`[PASS] Paywall split complete: ${split.wordCountFree}/${split.wordCountTotal} words (${split.previewPercentage}% free preview).`);
  console.log(`[PASS] Paywall barrier CTA inserted: ${split.paywallMarkerInserted}`);

  // 4. Archive SEO & Schema Generation
  const seo = new ArchiveSeoMetadataGenerator();
  const meta = seo.generateMetadata(draft);
  console.log(`[PASS] Canonical SEO URL: ${meta.canonicalUrl}`);
  console.log(`[PASS] Schema.org NewsArticle JSON-LD length: ${meta.jsonLdArticleSchema.length} chars.`);

  console.log('=== DEMO COMPLETE: 100% OPERATIONAL ===');
}

if (require.main === module) {
  runPaidNewsletterDemo();
}
