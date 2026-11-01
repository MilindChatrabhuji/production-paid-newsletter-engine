import { ResearchDossier, ResearchSourceItem } from './types';

export class NicheResearchDossierCompiler {
  public compileDossier(
    topicTitle: string,
    primaryThesis: string,
    sources: ResearchSourceItem[]
  ): ResearchDossier {
    const dossierId = `dos-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const generatedDateIso = new Date().toISOString();

    const executiveSummary = `Executive Intelligence Brief on "${topicTitle}": Analysis of ${sources.length} peer-reviewed and clinical datasets indicates robust evidence supporting: ${primaryThesis}. This brief synthesizes technical architectures, regulatory considerations, and clinical benchmarking metrics.`;

    const dataPoints = sources.flatMap(s => 
      s.keyFindings.map((f, i) => ({
        metricName: `Source ${s.publicationOrSource} Metric #${i + 1}`,
        value: f,
        benchmarkContext: s.clinicalOrTechnicalRelevance
      }))
    );

    return {
      dossierId,
      topicTitle,
      generatedDateIso,
      primaryThesis,
      sources,
      executiveSummary,
      dataPoints
    };
  }

  public getSampleClinicalDossier(): ResearchDossier {
    return this.compileDossier(
      'Autonomous Clinical Data Pipelines & FHIR v4.0.1 Edge Interoperability',
      'Deploying sub-10ms serverless edge gateways significantly reduces clinical API latencies while maintaining strict HIPAA and DPDP statutory compliance.',
      [
        {
          id: 'src-101',
          title: 'Evaluation of Global FHIR Interoperability Benchmarks in Distributed Health Systems',
          publicationOrSource: 'Journal of Medical Internet Research / Clinical Informatics',
          publishedDateIso: '2026-08-15T00:00:00Z',
          sourceUrl: 'https://newsletter.example.com/research/fhir-benchmarks',
          evidenceStrength: 'peer_reviewed_paper',
          keyFindings: [
            'Edge caching improved payload delivery by 72% across 54 testing nodes',
            'Zero data loss observed under simulated 15,000 req/sec stress test'
          ],
          clinicalOrTechnicalRelevance: 'Validates edge serverless routers for high-throughput clinical telemetry.'
        },
        {
          id: 'src-102',
          title: 'Regulatory Advisories on Cryptographic Token Entitlement in Electronic Health Records',
          publicationOrSource: 'Statutory Health Informatics Standards Board',
          publishedDateIso: '2026-10-01T00:00:00Z',
          sourceUrl: 'https://newsletter.example.com/research/ehr-advisory',
          evidenceStrength: 'regulatory_advisory',
          keyFindings: [
            'Sub-10ms JWT validation reduces token replay vulnerability windows',
            'Audit logging must be persisted in immutable relational edge datastores'
          ],
          clinicalOrTechnicalRelevance: 'Mandates strict cryptographic validation in edge membership and subscriber gateways.'
        }
      ]
    );
  }
}
