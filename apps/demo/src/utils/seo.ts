import { useEffect } from 'react';

type SeoConfig = {
  title: string;
  description: string;
  canonicalPath?: string;
};

function upsertMeta(name: string, content: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertOpenGraph(property: string, content: string) {
  let element = document.head.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

export function useSeo({ title, description, canonicalPath = '' }: SeoConfig) {
  useEffect(() => {
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertOpenGraph('og:title', title);
    upsertOpenGraph('og:description', description);

    const canonicalUrl = `https://zhangjiahang.com/react-virtualized-diff${canonicalPath}`;
    upsertCanonical(canonicalUrl);
    upsertOpenGraph('og:url', canonicalUrl);
  }, [title, description, canonicalPath]);
}
