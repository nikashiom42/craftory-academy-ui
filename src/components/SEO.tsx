/**
 * SEO component for managing page meta tags
 * Uses react-helmet-async for dynamic meta tag management
 */
import { Helmet } from 'react-helmet-async';
import { PageMeta } from '@/lib/seo';
import { buildTitle, getCanonicalUrl, getOgImageUrl } from '@/lib/seo';

interface SEOProps extends PageMeta {
  siteName?: string;
  siteUrl?: string;
  structuredData?: Record<string, unknown>;
  additionalStructuredData?: Record<string, unknown>[];
}

/**
 * SEO component that manages all meta tags for a page
 * Supports title, description, Open Graph, Twitter Cards, and structured data
 */
export function SEO({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  noindex = false,
  type = 'website',
  siteName = 'Craftory Academy',
  siteUrl = 'https://craftoryacademy.ge',
  structuredData,
  additionalStructuredData,
}: SEOProps) {
  const fullTitle = buildTitle(title, siteName);
  const canonicalUrl = canonical || getCanonicalUrl(typeof window !== 'undefined' ? window.location.pathname : '/', siteUrl);
  const ogImageUrl = getOgImageUrl(ogImage, siteUrl);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {canonical && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ka_GE" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {additionalStructuredData && additionalStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

