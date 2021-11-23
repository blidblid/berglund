import { InjectionToken } from '@angular/core';

export interface SeoTag {
  title: string;
  name: string;
  description: string;
  image: string;
  slug?: string;
}

export const SEO_TAG_DEFAULT = new InjectionToken<SeoTag>('SEO_TAG_DEFAULT');
export const SEO_URL = new InjectionToken<string>('SEO_TAG_URL');
export const SEO_CONTENT = new InjectionToken<string>('SEO_CONTENT');
