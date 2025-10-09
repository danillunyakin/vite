  // posts.js - ИСПРАВЛЕННАЯ ВЕРСИЯ

import { marked } from "marked";
import matter from "gray-matter";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const postsContainer = document.getElementById("posts-container");

// Эта часть остается без изменений
const modules = import.meta.glob("../../content/posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

// `Object.values(modules)` возвращает массив со строковым содержимым md-файлов
const rawContents = Object.values(modules);

// ВАЖНО: В цикле `map` переменная `rawContent` - это уже текст файла.
// Мы передаем его в `matter()` напрямую.
const posts = rawContents.map((rawContent) => {
  // Проверяем, что получили непустое значение, на всякий случай
  if (!rawContent) {
    return null;
  }
  const { data, content } = matter(rawContent); // <--- ИСПРАВЛЕНО ЗДЕСЬ
  return {
    title: data.title || "Без назви",
    date: data.date ? new Date(data.date) : new Date(),
    image: data.image || null,
    content: marked.parse(content),
  };
}).filter(post => post !== null); // Убираем пустые посты, если были ошибки


// Сортируем по дате (новые сверху)
posts.sort((a, b) => b.date - a.date);

// Функция для форматирования даты
function formatDate(date) {
  return date.toLocaleDateString("uk-UA", {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Рендерим посты
postsContainer.innerHTML = posts
  .map(
    (p) => `
      <article class="post">
        ${p.image ? `<img src="${p.image}" alt="${p.title}" class="post__img">` : ""}
        <h3 class="post__title">${p.title}</h3>
        <p class="post__date">${formatDate(p.date)}</p>
        <div class="post__content">${p.content}</div>
      </article>
    `
  )
  .join("");