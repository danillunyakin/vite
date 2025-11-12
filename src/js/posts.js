// src/js/posts.js

import '../scss/components/style.scss';
import { marked } from "marked";
import matter from "gray-matter";
import { Buffer } from 'buffer';
window.Buffer = Buffer;


//бургер меню

const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');


if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => {
 
    burgerBtn.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-active');
    
    
    document.body.classList.toggle('no-scroll'); 
  });
}


const postsContainer = document.getElementById("latest-posts-container");

if (postsContainer) {
  const modules = import.meta.glob("../../content/posts/*.md", {
    eager: true,
    import: "default",
    query: "?raw",
  });

  const rawContents = Object.values(modules);

  const posts = rawContents.map((rawContent) => {
    if (!rawContent) return null; 
    const { data, content } = matter(rawContent);
    
    const fullHtmlContent = marked.parse(content);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = fullHtmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const previewText = plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");

    return {
      title: data.title || "Без назви",
      date: data.date ? new Date(data.date) : new Date(),
      image: data.image || null,
      content: previewText, 
      galleryImageCount: data.gallery ? data.gallery.length : 0,
      // --- ДОБАВЛЕНО: Просто проверяем, есть ли видео ---
      video_file: data.video_file || null 
    };
  }).filter(post => post !== null);

  posts.sort((a, b) => b.date - a.date);

  const latestPosts = posts.slice(0, 3);

  function formatDate(date) {
    return date.toLocaleString("uk-UA", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  postsContainer.innerHTML = latestPosts
    .map(
      (p) => `
        <article class="post">
          
          <a href="/all-news.html" class="post__image-wrapper" target="_blank" rel="noopener noreferrer">
            
            ${p.image ? `<img src="${p.image}" alt="${p.title}" class="post__img">` : ""}
            
            <div classclass="post__indicators">
              
              ${p.galleryImageCount >= 2 ? ` 
                <div class="post__gallery-indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <span>${p.galleryImageCount + 1}</span> 
                </div>
              ` : ""}

              ${p.video_file ? `
                <div class="post__video-indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
              ` : ""}

            </div> </a>

          <div class="post__text-content">
            <h3 class="post__title">${p.title}</h3>
            <div class="post__content">${p.content}</div>
            <p class="post__date">${formatDate(p.date)}</p>
          </div>
        </article>
      `
    )
    .join("");

} 