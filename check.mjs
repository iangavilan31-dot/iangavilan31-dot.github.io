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
const stories = JSON.parse(await readFile(path.join(root, 'data/game-stories.json'), 'utf8'));
assert.ok(Array.isArray(projects) && projects.length, 'The collection must have projects.');
const ids = new Set();
for (const project of projects) {
  assert.ok(project.id && project.title && project.summary, `Missing project identity or summary: ${project.id}`);
  assert.ok(!ids.has(project.id), `Duplicate ID: ${project.id}`);
  ids.add(project.id);
  assert.ok(['Web', 'Apps', 'Games', 'Creative', 'Research'].includes(project.category), `Unknown category: ${project.category}`);
  for (const key of ['url', 'downloadUrl', 'sourceUrl', 'image', 'videoPoster', 'mascot', 'mascotSheet', 'video']) {
    if (!project[key]) continue;
    assert.ok(!/^\s*(javascript|data|file):/i.test(project[key]), `Unsafe ${key} on ${project.id}`);
    if (!/^[a-z]+:\/\//i.test(project[key]) && !project[key].startsWith('//')) {
      const local = project[key].split(/[?#]/)[0];
      await access(path.join(root, local));
    }
  }
  if (project.category === 'Games') {
    const story = stories[project.id];
    assert.ok(story && story.question && story.approach && story.practice && story.scope && story.reflection, `Incomplete story: ${project.id}`);
    assert.ok(story.steps?.length >= 2 && story.steps.every(step => step.title && step.body), `Missing build process: ${project.id}`);
    assert.ok(story.skills?.length >= 2, `Missing skills: ${project.id}`);
    const guide = await readFile(path.join(root, 'making', project.id, 'index.html'), 'utf8');
    assert.ok(guide.includes('id="the-build"') && guide.includes('id="the-practice"'), `Incomplete guide page: ${project.id}`);
    for (const ref of guide.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
      const target = path.join(root, ref[1]);
      await access(target);
    }
  }
  if (project.reel) {
    assert.ok(project.video && project.videoPoster && project.reel.duration > 0, `Invalid reel: ${project.id}`);
    let previousTime = -1;
    for (const chapter of project.reel.chapters) {
      assert.ok(Number.isFinite(chapter.time) && chapter.time >= 0 && chapter.time > previousTime && chapter.time < project.reel.duration && chapter.title && chapter.description, `Invalid reel chapter: ${project.id}`);
      previousTime = chapter.time;
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
console.log(`Portfolio checks passed: ${projects.length} projects, ${Object.keys(stories).length} game guides, ${projects.filter(project => project.reel).length} chaptered reels; local assets and destinations exist.`);
