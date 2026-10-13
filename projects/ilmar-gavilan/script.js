const pages = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "bio.html", label: "Bio", key: "bio" },
  { href: "awards.html", label: "Awards", key: "awards" },
  { href: "research.html", label: "Research", key: "research" },
  { href: "community.html", label: "Community", key: "community" },
];

const featuredVideos = [
  {
    title: "Schubert Quintet with Harlem Quartet and Carter Brey",
    description:
      "Public YouTube performance linked from the Los Hermanos film site playlist.",
    embed: "https://www.youtube.com/embed/xCvkdvTwx5E",
  },
  {
    title: "Harlem Quartet in Residence at the Royal College of Music",
    description:
      "A public video connected to the quartet's educational and performance residency work.",
    embed: "https://www.youtube.com/embed/s-Th_Tq0qY0",
  },
  {
    title: "Chick Corea and Gary Burton Hot House Tour",
    description:
      "A public video associated with the Grammy-recognized Harlem Quartet collaboration.",
    embed: "https://www.youtube.com/embed/7sGlKwxshaU",
  },
];

function renderHeader() {
  const headerRoot = document.getElementById("site-header");
  if (!headerRoot) return;

  const currentPage = document.body.dataset.page;

  headerRoot.innerHTML = `
    <header class="site-header">
      <nav class="nav-shell" aria-label="Primary">
        <a class="brand" href="index.html">Ilmar Gavilan</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          Menu
        </button>
        <div class="nav-links" id="site-nav">
          ${pages
            .map(
              (page) => `
                <a href="${page.href}" class="${
                  page.key === currentPage ? "active" : ""
                }">${page.label}</a>
              `
            )
            .join("")}
        </div>
      </nav>
    </header>
  `;

  const toggle = headerRoot.querySelector(".menu-toggle");
  const nav = headerRoot.querySelector(".nav-links");

  toggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
    const expanded = nav.classList.contains("open");
    toggle.setAttribute("aria-expanded", String(expanded));
  });
}

function renderFooter() {
  const footerRoot = document.getElementById("site-footer");
  if (!footerRoot) return;

  footerRoot.innerHTML = `
    <footer class="site-footer">
      <div class="footer-shell">
        <span>Ilmar Gavilan</span>
        <a href="mailto:igavilan@msmnyc.edu">igavilan@msmnyc.edu</a>
        <span>Copyright (c) 2026 Ilmar Gavilan</span>
      </div>
    </footer>
  `;
}

function renderVideos() {
  const videoGrid = document.getElementById("video-grid");
  if (!videoGrid) return;

  videoGrid.innerHTML = featuredVideos
    .map(
      (video) => `
        <article class="video-card">
          <iframe
            src="${video.embed}"
            title="${video.title}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <h3>${video.title}</h3>
          <p>${video.description}</p>
        </article>
      `
    )
    .join("");
}

renderHeader();
renderFooter();
renderVideos();
