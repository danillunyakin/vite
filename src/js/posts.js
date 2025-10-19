// src/js/posts.js - для главной страницы (3 последних поста)

import { marked } from "marked";
import matter from "gray-matter";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// 1. Знаходимо наш унікальний контейнер для 3-х новин
const postsContainer = document.getElementById("latest-posts-container");

// 2. Важливо! Виконуємо код, тільки якщо ми знайшли цей контейнер
//    (Це захистить від помилок на сторінці all-news.html)
if (postsContainer) {

  // 3. Зчитуємо всі markdown-файли з папки content/posts
  const modules = import.meta.glob("../../content/posts/*.md", {
    eager: true,
    import: "default",
    query: "?raw",
  });

  const rawContents = Object.values(modules);

  // 4. Перетворюємо файли на об'єкти з даними
  const posts = rawContents.map((rawContent) => {
    if (!rawContent) return null;
    const { data, content } = matter(rawContent);
    return {
      title: data.title || "Без назви",
      date: data.date ? new Date(data.date) : new Date(),
      image: data.image || null,
      // Обрізаємо текст до 150 символів для короткого превью
      content: marked.parse(content.substring(0, 150) + "..."),
      // Рахуємо, скільки фото в галереї (якщо вона є)
      galleryImageCount: data.gallery ? data.gallery.length : 0,
    };
  }).filter(post => post !== null);

  // 5. Сортуємо пости, щоб найновіші були першими
  posts.sort((a, b) => b.date - a.date);

  // 6. Беремо ТІЛЬКИ перші 3 пости (це робиться ОДИН раз)
  const latestPosts = posts.slice(0, 3);

  // 7. Функція для форматування дати
  function formatDate(date) {
    return date.toLocaleString("uk-UA", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // 8. Рендеримо 3 пости в HTML
  postsContainer.innerHTML = latestPosts
    .map(
      (p) => `
        <article class="post">
          <div class="post__image-wrapper">
            ${p.image ? `<img src="${p.image}" alt="${p.title}" class="post__img">` : ""}
            
            ${p.galleryImageCount >= 3 ? `
              <div class="post__gallery-indicator">
                <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span>${p.galleryImageCount}</span>
              </div>
            ` : ""}
          </div>

          <div class="post__text-content">
            <h3 class="post__title">${p.title}</h3>
            <div class="post__content">${p.content}</div>
            <p class="post__date">${formatDate(p.date)}</p>
          </div>
        </article>
      `
    )
    .join("");

} // <-- Кінець блоку if (postsContainer)