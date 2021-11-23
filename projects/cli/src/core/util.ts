import { existsSync, readFileSync } from 'fs';

export function dashCaseToPascalCase(str: string): string {
  return str.split('-').map(capitalize).join('');
}

export function toRelativePath(path: string): string {
  return `./${path}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function replaceAngularSyntax(content: string): string {
  return content.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
}

export function readJsonObjectSafely<T = object>(path: string, fallback: T): T {
  if (existsSync(path)) {
    try {
      return readJsonObject(path);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export function readJsonObject<T = object>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export function pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return array.map((element) => element[key]);
}

export function isNotNullOrUndefined<T>(
  value: T
): value is Exclude<T, null | undefined> {
  return value !== null && value !== undefined;
}
