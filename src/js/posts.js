  import { marked } from "marked";
  import matter from "gray-matter";

  const postsContainer = document.getElementById("posts-container");

  // Импортируем все markdown файлы из папки content/posts
  // const modules = import.meta.glob("../content/posts/*.md", { eager: true, import: "default", query: "?raw"});
  const modules = import.meta.glob("../../content/posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

  const posts = Object.entries(modules).map(([path, mod]) => {
    const raw = mod.default;
    const { data, content } = matter(raw);
    return {
      title: data.title || "Без назви",
      date: data.date ? new Date(data.date) : new Date(),
      image: data.image || null,
      content: marked.parse(content),
    };
  });

  console.log("Обработанные посты:", posts); // <--- И ЭТУ СТРОКУ

  // Отсортировать по дате (новые сверху)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Рендерим посты
  postsContainer.innerHTML = posts
    .map(
      (p) => `
      <article class="post">
        ${p.image ? `<img src="${p.image}" alt="${p.title}" class="post__img">` : ""}
        <h3 class="post__title">${p.title}</h3>
        <p class="post__date">${p.date}</p>
        <div class="post__content">${p.content}</div>
      </article>
    `
    )
    .join("");
