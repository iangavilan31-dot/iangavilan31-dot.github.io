// Year stamp in the footer.
const y = document.getElementById('year')
if (y) y.textContent = String(new Date().getFullYear())

// Reveal cards and rows as they enter the viewport. Skipped entirely when the
// visitor has asked for reduced motion — no transform, no opacity trick.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!reduced && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.card, .rowitem, .method')

  targets.forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(14px)'
    el.style.transition = 'opacity .55s ease, transform .55s ease'
  })

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        // Stagger within a batch so a grid row settles in sequence.
        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = 'none'
        }, Math.min(i * 60, 240))
        io.unobserve(el)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  )

  targets.forEach((el) => io.observe(el))
}
