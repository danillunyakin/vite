import includeHtml from "vite-plugin-include-html";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [includeHtml()]
});

// import { defineConfig } from 'vite';

// export default defineConfig({
//   base: '/', // укажи '/', чтобы пути всегда были абсолютные
// });