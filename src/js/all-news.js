// src/js/all-news.js

import '../scss/components/style.scss';
import { marked } from "marked";
import matter from "gray-matter";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const postsContainer = document.getElementById("posts-container");

if (postsContainer) {
  const modules = import.meta.glob("../../content/posts/*.md", {
    eager: true,
    import: "default",
    query: "?raw",
  });

  const rawContents = Object.values(modules);

  // --- НОВАЯ ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ ВИДЕО ---
  const createVideoHTML = (videoPath) => {
    if (!videoPath) {
      return ''; // Если видео нет, возвращаем пустую строку
    }
    // Возвращаем HTML5-плеер
    return `
      <div class="post__video-wrapper">
        <video controls width="100%" preload="metadata">
          <source src="${videoPath}" type="video/mp4">
          На жаль, ваш браузер не підтримує відтворення відео.
        </video>
      </div>
    `;
  };
  // --- КОНЕЦ НОВОЙ ФУНКЦИИ ---

  const createGalleryHTML = (galleryItems, galleryId) => {
    if (!galleryItems || galleryItems.length === 0) {
      return '';
    }
    return `
      <div class="post__gallery">
        ${galleryItems.map(item => `
          <figure class="post__gallery-item">
            <a href="${item.image}" data-fancybox="gallery-${galleryId}">
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
    const postDate = data.date ? new Date(data.date) : new Date();

    const finalGallery = data.gallery ? [...data.gallery] : []; 
    
    if (data.image) {
      finalGallery.unshift({
        image: data.image,
        alt: data.title + " (Головне фото)"
      });
    }

    return {
      title: data.title || "Без назви",
      date: postDate,
      content: marked.parse(content),
      galleryHTML: createGalleryHTML(finalGallery, postDate.getTime()),
      // --- ДОБАВЛЕНО: Генерируем HTML для видео ---
      videoHTML: createVideoHTML(data.video_file) 
    };
  }).filter(post => post !== null);

  posts.sort((a, b) => b.date - a.date);

  function formatDate(date) {
    return date.toLocaleDateString("uk-UA", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  postsContainer.innerHTML = posts
    .map(
      (p) => `
        <article class="post">
          
          ${p.videoHTML} 
          ${p.galleryHTML} 
          
          <h3 class="post__title">${p.title}</h3>
          <div class="post__content">${p.content}</div>
          
          <p class="post__date">${p.date ? formatDate(p.date) : ''}</p>
        </article>
      `
    )
    .join("");

  Fancybox.bind("[data-fancybox]");

} // <-- Кінець if (postsContainer)