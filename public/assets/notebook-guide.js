const video = document.querySelector('#game-reel');
const chapters = [...document.querySelectorAll('[data-time]')];
for (const button of chapters) {
  button.addEventListener('click', () => {
    const playChapter = () => {
      video.currentTime = Math.min(Number(button.dataset.time), Math.max(0, video.duration - .1));
      video.play().catch(() => {});
    };
    if (video.readyState >= 1) playChapter();
    else video.addEventListener('loadedmetadata', playChapter, { once: true });
  });
}
video?.addEventListener('timeupdate', () => {
  let selected = chapters[0];
  for (const chapter of chapters) if (Number(chapter.dataset.time) <= video.currentTime) selected = chapter;
  for (const chapter of chapters) {
    if (chapter === selected) chapter.setAttribute('aria-current', 'true');
    else chapter.removeAttribute('aria-current');
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) video?.pause(); });
for (const range of document.querySelectorAll('.comparison-range')) {
  const update = () => {
    range.parentElement.style.setProperty('--comparison-position', `${range.value}%`);
    range.setAttribute('aria-valuetext', `${range.value}% earlier version, ${100 - Number(range.value)}% current version`);
  };
  range.addEventListener('input', update);
  update();
}
