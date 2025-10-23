// src/js/all-news.js - для страницы со всеми новостями

// import '../scss/components/style.scss';
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

  // const posts = rawContents.map((rawContent) => {
  //   if (!rawContent) return null;
    
  //   const { data, content } = matter(rawContent);
  //   const postDate = data.date ? new Date(data.date) : new Date();

  //   return {
  //     title: data.title || "Без назви",
  //     date: postDate,
  //     image: data.image || null,
  //     content: marked.parse(content),
  //     galleryHTML: createGalleryHTML(data.gallery, postDate.getTime()) 
  //   };
  // }).filter(post => post !== null);

  const posts = rawContents.map((rawContent) => {
    if (!rawContent) return null;
    
    const { data, content } = matter(rawContent);
    const postDate = data.date ? new Date(data.date) : new Date();

    // --- 👇 ВОТ НОВАЯ ЛОГИКА 👇 ---
    
    // 1. Копіюємо існуючу галерею (якщо вона є)
    const finalGallery = data.gallery ? [...data.gallery] : []; 
    
    // 2. Якщо є головне фото (data.image), створюємо для нього об'єкт...
    if (data.image) {
      // ... і додаємо його на ПОЧАТОК масиву finalGallery
      finalGallery.unshift({
        image: data.image,
        alt: data.title + " (Головне фото)" // Додаємо опис для головного фото
      });
    }
    // --- 👆 КОНЕЦ НОВОЙ ЛОГИКИ 👆 ---

    return {
      title: data.title || "Без назви",
      date: postDate,
      // image: data.image || null, // 👈 Головне фото тут більше не потрібне
      content: marked.parse(content),
      galleryHTML: createGalleryHTML(finalGallery, postDate.getTime()) // 👈 Передаємо новий об'єднаний масив
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

  // --- ОСЬ ТУТ ЗМІНИ ---
  // Ми поміняли місцями galleryHTML та title/content
  postsContainer.innerHTML = posts
    .map(
      (p) => `
        <article class="post">
          
          ${p.galleryHTML} <h3 class="post__title">${p.title}</h3>
          <div class="post__content">${p.content}</div>
          
          <p class="post__date">${p.date ? formatDate(p.date) : ''}</p>
        </article>
      `
    )
    .join("");

  // "Вмикаємо" Fancybox для всіх посилань, які мають data-fancybox
  Fancybox.bind("[data-fancybox]");

} // <-- Кінець if (postsContainer)