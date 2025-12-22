// import { defineConfig } from "eslint/config";
// import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
// import path from "node:path";
// import { fileURLToPath } from "node:url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default defineConfig([{
//     extends: [...nextCoreWebVitals],
// }]);

import { defineConfig } from "eslint/config";
import nextConfig from "eslint-config-next";

export default defineConfig([
  nextConfig,
  {
    rules: {
      // tus reglas personalizadas van aquí
    },
  },
]);