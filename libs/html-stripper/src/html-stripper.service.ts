import { Inject, Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { createHash } from 'crypto';
import * as he from 'he';
import { LRUCache } from 'lru-cache';
import { HtmlContentDto, StrippedContentDto } from './dto/html-content.dto';
import {
  HtmlStripperConfig,
  defaultHtmlStripperConfig,
} from './htm-stripper.config';

@Injectable()
export class HtmlStripperService {
  private readonly logger = new Logger(HtmlStripperService.name);
  private readonly config: HtmlStripperConfig;
  private readonly cache: LRUCache<string, string>;

  constructor(
    @Inject('HTML_STRIPPER_CONFIG')
    private readonly htmlStripperConfig: Partial<HtmlStripperConfig>,
  ) {
    this.config = {
      ...defaultHtmlStripperConfig,
      ...this.htmlStripperConfig,
    };

    // Initialize cache if enabled
    if (this.config.enableCaching) {
      this.cache = new LRUCache({
        max: this.config.cacheSize,
        ttl: this.config.cacheTTL * 1000,
      });
    }
  }

  /**
   * Main method to strip HTML and return clean text
   */
  stripHtml(dto: HtmlContentDto): StrippedContentDto {
    const startTime = Date.now();
    const originalLength = dto.html.length;

    try {
      // Validation
      if (originalLength > this.config.maxContentLength) {
        throw new Error(
          `Content too large. Max allowed: ${this.config.maxContentLength} characters`,
        );
      }

      // Check cache first
      let text: string = '';
      let cached = false;

      if (this.config.enableCaching) {
        const cacheKey = this.generateCacheKey(dto.html);
        const cachedResult = this.cache.get(cacheKey);

        if (cachedResult) {
          text = cachedResult;
          cached = true;
          this.logger.debug('Content retrieved from cache');
        }
      }

      // Process if not cached
      if (!text) {
        if (dto.extractMainContent) {
          text = this.extractMainContent(dto.html);
        } else {
          text = this.basicStripHtml(dto.html);
        }

        // Apply formatting options
        if (dto.preserveFormatting) {
          text = this.preserveBasicFormatting(text);
        } else {
          text = this.cleanWhitespace(text);
        }

        // Cache the result
        if (this.config.enableCaching) {
          const cacheKey = this.generateCacheKey(dto.html);
          this.cache.set(cacheKey, text);
        }
      }

      const processingTime = Date.now() - startTime;

      this.logger.debug(
        `HTML stripped: ${originalLength} -> ${text.length} chars in ${processingTime}ms`,
      );

      return {
        text: text || '',
        originalLength,
        strippedLength: text.length,
        processingTime,
        cached,
      };
    } catch (error) {
      this.logger.error('Error stripping HTML:', error.message);
      throw error;
    }
  }

  /**
   * Extract main content from HTML (more intelligent)
   */
  private extractMainContent(html: string): string {
    const $ = cheerio.load(html);

    // Remove unwanted tags
    this.config.removeUnwantedTags.forEach((tag) => {
      $(tag).remove();
    });

    // Remove unwanted selectors
    this.config.removeUnwantedSelectors.forEach((selector) => {
      $(selector).remove();
    });

    // Try to find main content area
    let mainContent = $('article').first();
    if (mainContent.length === 0) {
      mainContent = $('main').first();
    }
    if (mainContent.length === 0) {
      mainContent = $(
        '.post-content, .article-content, .entry-content, .content',
      ).first();
    }
    if (mainContent.length === 0) {
      mainContent = $('body');
    }

    // Extract text
    let text = mainContent.text();

    // Decode HTML entities
    text = he.decode(text);

    return text;
  }

  /**
   * Basic HTML stripping
   */
  private basicStripHtml(html: string): string {
    const $ = cheerio.load(html);

    // Remove unwanted tags
    this.config.removeUnwantedTags.forEach((tag) => {
      $(tag).remove();
    });

    let text = $.root().text();
    text = he.decode(text);

    return text;
  }

  /**
   * Preserve basic formatting
   */
  private preserveBasicFormatting(text: string): string {
    return text
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Max 2 consecutive newlines
      .replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single space
      .trim();
  }

  /**
   * Clean all whitespace aggressively
   */
  private cleanWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(html: string): string {
    return createHash('md5').update(html).digest('hex');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    if (!this.config.enableCaching || !this.cache) {
      return { enabled: false };
    }

    return {
      enabled: true,
      size: this.cache.size,
      maxSize: this.config.cacheSize,
      hitRate:
        this.cache.calculatedSize /
        (this.cache.calculatedSize + this.cache.size),
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    if (this.cache) {
      this.cache.clear();
      this.logger.log('Cache cleared');
    }
  }
}
