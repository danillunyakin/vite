// src/js/all-news.js - для страницы со всеми новостями

import { marked } from "marked";
import matter from "gray-matter";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// Убедитесь, что на странице /news.html у контейнера ID="posts-container"
const postsContainer = document.getElementById("posts-container");

const modules = import.meta.glob("../../content/posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const rawContents = Object.values(modules);

// Функция для создания HTML-кода галереи
const createGalleryHTML = (galleryItems) => {
  if (!galleryItems || galleryItems.length === 0) {
    return ''; // Если картинок в галерее нет, возвращаем пустоту
  }
  return `
    <div class="post__gallery">
      ${galleryItems.map(item => `
        <figure class="post__gallery-item">
          <a href="${item.image}" data-fancybox="gallery">
             <img src="${item.image}" alt="${item.alt || 'Gallery image'}" class="post__gallery-image">
          </a>
          ${item.alt ? `<figcaption class="post__gallery-caption">${item.alt}</figcaption>` : ''}
        </figure>
      `).join('')}
    </div>
  `;
};

const posts = rawContents.map((rawContent) => {
  if (!rawContent) return null;
  
  const { data, content } = matter(rawContent);
  return {
    title: data.title || "Без назви",
    date: data.date ? new Date(data.date) : new Date(),
    image: data.image || null,
    content: marked.parse(content), // Здесь полный текст, без обрезки
    galleryHTML: createGalleryHTML(data.gallery) // Создаем HTML для галереи
  };
}).filter(post => post !== null);

// Сортируем посты
posts.sort((a, b) => b.date - a.date);

function formatDate(date) {
  return date.toLocaleDateString("uk-UA", {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Рендерим ВСЕ посты
postsContainer.innerHTML = posts
  .map(
    (p) => `
      <article class="post">
        ${p.image ? `<img src="${p.image}" alt="${p.title}" class="post__img">` : ""}
        <h3 class="post__title">${p.title}</h3>
        <div class="post__content">${p.content}</div>
        ${p.galleryHTML} 
        <p class="post__date">${p.date ? formatDate(p.date) : ''}</p>
      </article>
    `
  )
  .join("");