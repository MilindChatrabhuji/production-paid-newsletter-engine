import { NewsletterDraft, ArchiveSeoMetadata } from './types';

export class ArchiveSeoMetadataGenerator {
  public generateMetadata(draft: NewsletterDraft, baseArchiveDomain: string = 'newsletter.example.com'): ArchiveSeoMetadata {
    const canonicalUrl = `https://${baseArchiveDomain}/archive/${draft.slug}`;
    const metaTitle = `${draft.title} — Edition #${draft.editionNumber} | Clinical & Architecture Intelligence`;
    const metaDescription = `${draft.subtitle} Written by ${draft.authorName}. Verified peer-reviewed datasets and sub-10ms edge architecture analysis.`;

    const jsonLdArticleSchema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': draft.title,
      'description': metaDescription,
      'datePublished': draft.publishedDateIso,
      'dateModified': draft.publishedDateIso,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      'author': {
        '@type': 'Person',
        'name': draft.authorName,
        'jobTitle': 'Founder & Medical Informatician'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Production Niche Newsletter Engine',
        'logo': {
          '@type': 'ImageObject',
          'url': `https://${baseArchiveDomain}/assets/paid_newsletter_hero.svg`
        }
      },
      'isAccessibleForFree': false,
      'hasPart': {
        '@type': 'WebPageElement',
        'isAccessibleForFree': false,
        'cssSelector': '.subscriber-paywall-barrier'
      }
    }, null, 2);

    return {
      editionId: draft.editionId,
      slug: draft.slug,
      canonicalUrl,
      metaTitle,
      metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        image: `https://${baseArchiveDomain}/assets/paid_newsletter_hero.svg`,
        type: 'article',
        publishedTime: draft.publishedDateIso,
        authors: [draft.authorName]
      },
      jsonLdArticleSchema
    };
  }
}
