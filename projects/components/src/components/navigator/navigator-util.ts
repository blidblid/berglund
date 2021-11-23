export function searchSubString(full: string, sub: string): boolean {
  return full.toLowerCase().startsWith(sub.toLowerCase());
}
