import { useEffect } from 'react';
import { NewsArticle } from '../types';

interface SEOProps {
  article?: NewsArticle;
  title?: string;
  description?: string;
}

export default function SEO({ article, title, description }: SEOProps) {
  useEffect(() => {
    // Save original values
    const originalTitle = document.title;
    const ogMetaTags: { [key: string]: string | null } = {};
    const metaSelectors = [
      'meta[name="description"]',
      'meta[name="keywords"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:image"]',
      'meta[property="og:type"]',
      'meta[property="og:url"]',
      'meta[name="twitter:card"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="twitter:image"]',
    ];

    metaSelectors.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) {
        ogMetaTags[selector] = el.getAttribute('content');
      } else {
        ogMetaTags[selector] = null;
      }
    });

    // Helper to set or create meta tag
    const setMetaTag = (nameOrProperty: string, content: string, isProperty = false) => {
      const selector = isProperty 
        ? `meta[property="${nameOrProperty}"]` 
        : `meta[name="${nameOrProperty}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', nameOrProperty);
        } else {
          el.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to remove any newly created meta tag that wasn't there before
    const restoreMetaTag = (selector: string, originalVal: string | null) => {
      const el = document.querySelector(selector);
      if (el) {
        if (originalVal === null) {
          el.remove();
        } else {
          el.setAttribute('content', originalVal);
        }
      }
    };

    // Setup JSON-LD Structured Data for search engine rich snippets/images/tags representation
    let jsonLdScript: HTMLScriptElement | null = null;

    // Helper to set canonical link
    const setCanonicalLink = (url: string) => {
      let el = document.querySelector('link[rel="canonical"]');
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
      }
      el.setAttribute('href', url);
    };

    const pathSuffix = window.location.hash || '';
    const canonicalUrl = `https://creed-football.netlify.app/${pathSuffix}`;

    if (article) {
      // 1. Build a robust search-engine friendly title
      const seoTitle = `${article.title} | Creed Football Reports`;
      const seoDesc = article.summary || article.content.substring(0, 160) + '...';
      
      // 2. Synthesize tags & categories into unified keywords
      const categoryTags = [
        article.category,
        article.tag,
        ...(Array.isArray(article.tags) ? article.tags : []),
        'football news',
        'transfers',
        'tactical analysis'
      ].filter((v, i, self) => v && self.indexOf(v) === i) as string[];

      const seoKeywords = categoryTags.join(', ');

      // 3. Set standard meta tags
      document.title = seoTitle;
      setMetaTag('description', seoDesc);
      setMetaTag('keywords', seoKeywords);
      setCanonicalLink(canonicalUrl);

      // 4. Set OpenGraph tags (Ensures Google and social networks preview images!)
      setMetaTag('og:title', seoTitle, true);
      setMetaTag('og:description', seoDesc, true);
      setMetaTag('og:image', article.image, true);
      setMetaTag('og:type', 'article', true);
      setMetaTag('og:url', canonicalUrl, true);

      // 5. Set Twitter tags
      setMetaTag('twitter:card', 'summary_large_image');
      setMetaTag('twitter:title', seoTitle);
      setMetaTag('twitter:description', seoDesc);
      setMetaTag('twitter:image', article.image);

      // 6. Inject Schema.org JSON-LD (Search engines love this for categories, tags, publishing date, and image listing!)
      const jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        'headline': article.title,
        'image': [article.image],
        'datePublished': new Date(article.date).toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        'dateModified': new Date(article.date).toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        'author': {
          '@type': 'Organization',
          'name': 'Creed Football Editorial Team'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Creed Football',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://od.lk/s/MjNfNzg4NjY3NDZf/1000378993-removebg-preview.png'
          }
        },
        'description': seoDesc,
        'articleSection': article.category,
        'keywords': categoryTags.join(',')
      };

      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.text = JSON.stringify(jsonLdData);
      document.head.appendChild(jsonLdScript);

    } else {
      // General homepage SEO tags
      const currentTitle = title || 'Creed Football | Live Scores, News, Transfers & Tactical Analyses';
      const currentDesc = description || 'Creed Football delivers the fastest live scores, breaking transfer rumors, expert news coverage, in-depth tactical analyses, and dynamic matchday insights. Be the first to know about your favorite clubs and leagues around the world.';
      
      document.title = currentTitle;
      setMetaTag('description', currentDesc);
      setMetaTag('og:title', currentTitle, true);
      setMetaTag('og:description', currentDesc, true);
      setMetaTag('og:url', canonicalUrl, true);
      setCanonicalLink(canonicalUrl);
    }

    // Cleanup on unmount / change
    return () => {
      document.title = originalTitle;
      metaSelectors.forEach(selector => {
        restoreMetaTag(selector, ogMetaTags[selector]);
      });
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        canonicalEl.remove();
      }
      if (jsonLdScript) {
        jsonLdScript.remove();
      }
    };
  }, [article, title, description]);

  return null;
}
