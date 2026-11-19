import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function findLatestTags(dockerfile) {
  return [...dockerfile.matchAll(/@latest\b/g)].map((match) => match[0]);
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const dockerfile = readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8');
  const latest = findLatestTags(dockerfile);
  if (latest.length) {
    console.error(`unpinned @latest in Dockerfile: ${latest.join(', ')}`);
    process.exitCode = 1;
  } else {
    console.log('Dockerfile has no @latest tags');
  }
}
