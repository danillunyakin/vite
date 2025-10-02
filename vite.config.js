// import includeHtml from "vite-plugin-include-html";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [includeHtml()]
// });


import includeHtml from "vite-plugin-include-html";
import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
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
});



// import { defineConfig } from 'vite';

// export default defineConfig({
//   base: '/', // укажи '/', чтобы пути всегда были абсолютные
// });