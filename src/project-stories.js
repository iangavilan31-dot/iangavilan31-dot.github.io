const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

export function makingOverview(project) {
  if (!project.story) return null;
  const story = project.story;
  const section = make('section', 'making-overview');
  section.setAttribute('aria-label', `Behind ${project.title}`);
  const rows = [
    ['the curiosity', story.question],
    ['the making', story.approach],
    ['the practice', story.practice],
  ];
  const summary = make('dl', 'making-notes');
  for (const [label, copy] of rows) {
    const row = make('div', 'making-note');
    row.append(make('dt', '', label), make('dd', '', copy));
    summary.append(row);
  }
  const link = make('a', 'making-link', 'read the full making of ↗');
  link.href = `./making/${encodeURIComponent(project.id)}/`;
  section.append(make('p', 'eyebrow', 'a look behind the game'), summary, link);
  return section;
}

export function reelChapters(project, video) {
  if (!project.reel?.chapters?.length || !video) return null;
  const controls = make('div', 'reel-chapters');
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', `${project.title} reel chapters`);
  const buttons = project.reel.chapters.map((chapter, index) => {
    const button = make('button', 'reel-chapter');
    button.type = 'button';
    button.append(make('span', 'reel-chapter-number', String(index + 1).padStart(2, '0')), make('span', '', chapter.title));
    button.setAttribute('aria-label', `Watch ${chapter.title}`);
    button.addEventListener('click', () => {
      const seek = () => {
        video.currentTime = Math.min(chapter.time, Math.max(0, video.duration - .1));
        video.play().catch(() => {});
      };
      if (video.readyState >= 1) seek();
      else video.addEventListener('loadedmetadata', seek, { once: true });
    });
    controls.append(button);
    return button;
  });
  const update = () => {
    let current = 0;
    project.reel.chapters.forEach((chapter, index) => { if (video.currentTime >= chapter.time) current = index; });
    buttons.forEach((button, index) => {
      if (index === current) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  };
  video.addEventListener('timeupdate', update);
  update();
  return controls;
}
