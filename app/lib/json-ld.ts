import { SEO_CONFIG } from './seo-config';

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SEO_CONFIG.siteName,
  "url": SEO_CONFIG.siteUrl,
  "description": SEO_CONFIG.defaultDescription,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SEO_CONFIG.siteUrl}/cards?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "fr-FR",
};

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SEO_CONFIG.siteName,
  "url": SEO_CONFIG.siteUrl,
  "logo": `${SEO_CONFIG.siteUrl}/logo.png`,
  "description": SEO_CONFIG.defaultDescription,
  "sameAs": [
    "https://twitter.com/riftbound",
    "https://discord.gg/riftbound",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["French", "English"]
  },
};

export function generateArticleJSON_LD(title: string, description: string, url: string, image?: string, datePublished?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url,
    "image": image || SEO_CONFIG.defaultImage,
    "author": {
      "@type": "Organization",
      "name": SEO_CONFIG.siteName,
    },
    "publisher": {
      "@type": "Organization",
      "name": SEO_CONFIG.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${SEO_CONFIG.siteUrl}/logo.png`,
      },
    },
    "datePublished": datePublished || new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "inLanguage": "fr-FR",
  };
}

export function generateBreadcrumbJSON_LD(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

export function generateFAQJSON_LD(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateHowToJSON_LD(title: string, description: string, steps: { name: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
    })),
    "totalTime": "PT30M",
    "inLanguage": "fr-FR",
  };
}

export function generateVideoGameSchema(title: string, description: string, genre: string, platform: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": title,
    "description": description,
    "genre": genre,
    "platform": platform,
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "inLanguage": "fr-FR",
  };
}

export function generateCollectionPageSchema(name: string, description: string, url: string, itemCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url,
    "numberOfItems": itemCount,
    "inLanguage": "fr-FR",
  };
}

export function generateWebApplicationSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": "fr-FR",
  };
}
