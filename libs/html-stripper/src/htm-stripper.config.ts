export interface HtmlStripperConfig {
  removeUnwantedTags: string[];
  removeUnwantedSelectors: string[];
  preserveTags: string[];
  maxContentLength: number;
  enableCaching: boolean;
  cacheSize: number;
  cacheTTL: number; // seconds
}

export const defaultHtmlStripperConfig: HtmlStripperConfig = {
  removeUnwantedTags: [
    'script',
    'style',
    'nav',
    'header',
    'footer',
    'aside',
    'iframe',
    'object',
    'embed',
    'applet',
    'form',
  ],
  removeUnwantedSelectors: [
    '.advertisement',
    '.ads',
    '.sidebar',
    '.related-posts',
    '.comments',
    '.social-share',
    '.newsletter-signup',
    '[class*="ad-"]',
    '[id*="ad-"]',
    '[class*="banner"]',
    '.cookie-notice',
    '.popup',
    '.modal',
  ],
  preserveTags: ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  maxContentLength: 1000000, // 1MB
  enableCaching: true,
  cacheSize: 1000,
  cacheTTL: 3600, // 1 hour
};
