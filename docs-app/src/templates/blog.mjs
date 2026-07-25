import { strings, blogHref, blogTagLabels } from '../nav.mjs';

function formatDate(lang, isoDate) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

function tagsMarkup(lang, tags) {
  const labels = blogTagLabels[lang];
  const items = tags.map((tag) => `<li class="post-tag">${labels[tag] ?? tag}</li>`).join('');
  return `<ul class="post-tags">${items}</ul>`;
}

/** Meta line (publish date + tags) shown at the top of a single post. */
export function renderPostMeta(lang, entry) {
  const s = strings[lang];
  return `
  <div class="post-header__meta">
    <span class="post-header__date">${s.blogPublishedOn} ${formatDate(lang, entry.date)}</span>
    ${tagsMarkup(lang, entry.tags)}
  </div>`;
}

/** Body of the /blog index page: a reverse-chronological grid of post cards. */
export function renderBlogIndexBody(lang, posts) {
  const s = strings[lang];
  const cards = posts
    .map(
      (post) => `
    <a class="post-card" href="${blogHref(lang, post.id)}">
      <div class="post-card__meta">
        <span>${formatDate(lang, post.date)}</span>
        ${tagsMarkup(lang, post.tags)}
      </div>
      <h2>${post.title}</h2>
      <p>${post.description}</p>
    </a>`,
    )
    .join('');

  return `
  <section class="section">
    <div class="container">
      <div class="section__head">
        <h1>${s.blogHeroTitle}</h1>
        <p>${s.blogHeroLede}</p>
      </div>
      <div class="post-grid">${cards}</div>
    </div>
  </section>`;
}
