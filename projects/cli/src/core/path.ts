import * as path from 'path';

export function join(...segments: string[]) {
  return posix(path.join(...segments));
}

export function resolve(...segments: string[]) {
  return posix(path.resolve(...segments));
}

function posix(p: string): string {
  return p.replace(/\\/g, '/');
}
