import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoTag } from './seo-model';
import { SEO_DEFAULT_TAGS } from './seo-model-private';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private metaService: Meta, private titleService: Title) {}

  setTags(tags: SeoTag = {}): void {
    tags = { ...SEO_DEFAULT_TAGS, ...tags };

    this.titleService.setTitle(tags.title);

    const twitterTags = [
      { property: 'twitter:card', content: tags.description },
      { property: 'twitter:title', content: tags.title },
      { property: 'twitter:description', content: tags.description },
      { property: 'twitter:image', content: tags.image },
    ];

    const ogTags = [
      { property: 'og:type', content: '' },
      { property: 'og:title', content: tags.title },
      { property: 'og:site_name', content: tags.name },
      { property: 'og:description', content: tags.description },
      { property: 'og:image', content: tags.image },
      { property: 'og:url', content: 'https://showcase.com' },
    ];

    const vanillaTags = [
      { name: 'description', content: tags.description },
      { name: 'keywords', content: 'revive games' },
    ];

    [...twitterTags, ...ogTags, ...vanillaTags].forEach((tag) =>
      this.metaService.updateTag(tag)
    );
  }
}
