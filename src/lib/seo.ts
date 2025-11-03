/**
 * SEO utility functions and types
 * Provides utilities for generating meta tags, structured data, and canonical URLs
 */

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * Builds full page title with site name
 */
export function buildTitle(title: string, siteName: string = 'Craftory Academy'): string {
  return `${title} | ${siteName}`;
}

/**
 * Generates canonical URL from path
 */
export function getCanonicalUrl(path: string, baseUrl: string = 'https://craftoryacademy.ge'): string {
  return `${baseUrl}${path === '/' ? '' : path}`;
}

/**
 * Generates Open Graph image URL
 */
export function getOgImageUrl(imagePath?: string, baseUrl: string = 'https://craftoryacademy.ge'): string {
  if (imagePath) {
    return imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;
  }
  return `${baseUrl}/logo.png`;
}

