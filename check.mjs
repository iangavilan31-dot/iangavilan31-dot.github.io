import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
for (const ref of html.matchAll(/(?:href|src)="(\.\/[^"?#]+)/g)) await access(path.join(root, ref[1]));
await access(path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/experience.js'));
const data = JSON.parse(await readFile(path.join(root, 'data/projects.json'), 'utf8'));
const projects = Array.isArray(data) ? data : data.projects;
assert.ok(Array.isArray(projects) && projects.length, 'The collection must have projects.');
const ids = new Set();
for (const project of projects) {
  assert.ok(project.id && project.title && project.summary, `Missing project identity or summary: ${project.id}`);
  assert.ok(!ids.has(project.id), `Duplicate ID: ${project.id}`);
  ids.add(project.id);
  assert.ok(['Web', 'Apps', 'Games', 'Creative', 'Research'].includes(project.category), `Unknown category: ${project.category}`);
  for (const key of ['url', 'downloadUrl', 'sourceUrl', 'image', 'mascot', 'mascotSheet', 'video']) {
    if (!project[key]) continue;
    assert.ok(!/^\s*(javascript|data|file):/i.test(project[key]), `Unsafe ${key} on ${project.id}`);
    if (!/^[a-z]+:\/\//i.test(project[key]) && !project[key].startsWith('//')) {
      const local = project[key].split(/[?#]/)[0];
      await access(path.join(root, local));
    }
  }
  if (project.comparison) {
    for (const key of ['before', 'after']) {
      const url = project.comparison[key];
      assert.ok(typeof url === 'string' && url, `Missing comparison ${key} on ${project.id}`);
      assert.ok(!/^\s*(javascript|data|file):/i.test(url), `Unsafe comparison ${key} on ${project.id}`);
      if (!/^[a-z]+:\/\//i.test(url) && !url.startsWith('//')) await access(path.join(root, url.split(/[?#]/)[0]));
    }
  }
}
console.log(`Portfolio checks passed: ${projects.length} unique projects; local assets and project destinations exist.`);
