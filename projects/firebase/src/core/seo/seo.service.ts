import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoTag, SEO_CONTENT, SEO_TAG_DEFAULT, SEO_URL } from './seo-model';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private metaService: Meta,
    private titleService: Title,
    @Inject(SEO_TAG_DEFAULT) private defaultSeoTag: SeoTag,
    @Inject(SEO_URL) private url: string,
    @Inject(SEO_CONTENT) private content: string
  ) {}

  setTags(partialTag: Partial<SeoTag>) {
    const tag = { ...this.defaultSeoTag, ...partialTag };

    this.titleService.setTitle(tag.title);

    const twitterTags = [
      { property: 'twitter:card', content: tag.description },
      { property: 'twitter:title', content: tag.title },
      { property: 'twitter:description', content: tag.description },
      { property: 'twitter:image', content: tag.image },
    ];

    const ogTags = [
      { property: 'og:type', content: '' },
      { property: 'og:title', content: tag.title },
      { property: 'og:site_name', content: tag.name },
      { property: 'og:description', content: tag.description },
      { property: 'og:image', content: tag.image },
      { property: 'og:url', content: this.url },
    ];

    const vanillaTags = [
      { name: 'description', content: tag.description },
      {
        name: 'keywords',
        content: this.content,
      },
    ];

    [...twitterTags, ...ogTags, ...vanillaTags].forEach((tag) =>
      this.metaService.updateTag(tag)
    );
  }
}
