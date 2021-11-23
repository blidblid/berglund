export function toUrl(paths: string[], withLeadingSlash?: boolean): string {
  return [...(withLeadingSlash ? [''] : []), ...paths].join('/');
}
