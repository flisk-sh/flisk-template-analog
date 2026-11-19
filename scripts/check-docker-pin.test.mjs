import assert from 'node:assert/strict';
import test from 'node:test';
import { findLatestTags } from './check-docker-pin.mjs';

test('flags @latest scaffolder tags', () => {
  assert.deepEqual(findLatestTags('RUN npm create analog@latest app'), ['@latest']);
  assert.deepEqual(findLatestTags('FROM node:22-alpine@sha256:abc\nRUN npm create analog@2.9.7 app'), []);
});

test('ignores pinned digests and unrelated latest text', () => {
  const dockerfile = 'FROM node:22-alpine@sha256:abc\n# never use latest\nRUN npm create analog@2.9.7 app\n';
  assert.deepEqual(findLatestTags(dockerfile), []);
});
