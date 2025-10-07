import.meta.glob("../content/posts/*.md", { eager: true });
import { marked } from "marked";

const postsContainer = document.getElementById("posts-container");
const modules = import.meta.glob("../content/posts/*.md", { eager: true });

const posts = Object.values(modules).map((mod) => ({
  content: mod.default,
}));

postsContainer.innerHTML = posts
  .map(
    (p) => `
    <article class="post">
      <div class="post__content">${marked.parse(p.content)}</div>
    </article>
  `
  )
  .join("");