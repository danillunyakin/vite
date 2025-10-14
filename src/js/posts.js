// src/js/posts.js - для главной страницы (3 последних поста)

import { marked } from "marked";
import matter from "gray-matter";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// Убедитесь, что ID контейнера в вашем HTML совпадает с этим
const postsContainer = document.getElementById("posts-container");

const modules = import.meta.glob("../../content/posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const rawContents = Object.values(modules);

const posts = rawContents.map((rawContent) => {
  if (!rawContent) return null;
  const { data, content } = matter(rawContent);
  return {
    title: data.title || "Без назви",
    date: data.date ? new Date(data.date) : new Date(),
    image: data.image || null,
    // Обрезаем текст до 150 символов для короткого превью
    content: marked.parse(content.substring(0, 150) + "..."),
    // Считаем, сколько фото в галерее (если она есть)
    galleryImageCount: data.gallery ? data.gallery.length : 0,
  };
}).filter(post => post !== null);

// Сортируем посты, чтобы самые новые были первыми
posts.sort((a, b) => b.date - a.date);

// --- ГЛАВНОЕ ИЗМЕНЕНИЕ: БЕРЕМ ТОЛЬКО ПЕРВЫЕ 3 ПОСТА ---
const latestPosts = posts.slice(0, 3);

function formatDate(date) {
  return date.toLocaleDateString("uk-UA", {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Рендерим 3 поста в HTML
postsContainer.innerHTML = latestPosts
  .map(
    (p) => `
      <article class="post">
        <div class="post__image-wrapper">
          ${p.image ? `<img src="${p.image}" alt="${p.title}" class="post__img">` : ""}
          
          ${p.galleryImageCount >=   3 ? `
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