import includeHtml from "vite-plugin-include-html";
import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  // Ваш існуючий плагін для <include>
  plugins: [
    includeHtml(),
    {
      name: "copy-redirects",
      closeBundle() {
        copyFileSync(
          resolve(__dirname, "public/_redirects"),
          resolve(__dirname, "dist/_redirects")
        );
      },
    },
  ],

  // --- ДОДАЙТЕ ЦЕЙ БЛОК ---
  // Це вкаже Vite, які HTML-файли потрібно збирати
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),      // Ваша головна сторінка
        news: resolve(__dirname, 'all-news.html')   // Ваша сторінка новин
      }
    }
  }
  // --- КІНЕЦЬ БЛОКУ ---
});