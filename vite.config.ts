import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Inspect from "vite-plugin-inspect";
import { rezact } from "./src/lib/rezact/vite-plugin";
import { rezact_mdx } from "./src/lib/rezact/vite-mdx-plugin";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeHighlight from "rehype-highlight";
import mdx from "@mdx-js/rollup";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  // console.log({ command, mode, ssrBuild, example: process.env.example });

  const config: any = {
    esbuild: {
      jsxFactory: "xCreateElement",
      jsxFragment: "xFragment",
    },
    test: {
      globals: true,
      environment: "happy-dom",
    },
    resolve: {
      alias: {
        src: "/src",
        rezact: "/src/lib/rezact",
      },
    },
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: [
          resolve(__dirname, "src/lib/rezact/mapState.ts"),
          resolve(__dirname, "src/lib/rezact/vite-mdx-plugin.ts"),
          resolve(__dirname, "src/lib/rezact/mdx.ts"),
          resolve(__dirname, "src/lib/rezact/vite-plugin.ts"),
          resolve(__dirname, "src/lib/rezact/router.ts"),
          resolve(__dirname, "src/lib/rezact/index.ts"),
          resolve(__dirname, "src/lib/rezact/signals.ts"),
          resolve(__dirname, "src/lib/rezact/validator.ts"),
        ],
        name: "Rezact",
        // the proper extensions will be added
        // fileName: "rezact",
      },
      emptyOutDir: true,
      target: "esnext",
      modulePreload: {
        polyfill: false,
      },
      minify: false,
    },
    plugins: [
      Inspect(),
      mdx({
        pragma: "r.xCreateElement",
        pragmaFrag: "r.xFragment",
        jsxRuntime: "classic",
        pragmaImportSource: "src/lib/rezact/mdx",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "fm" }],
        ],
        rehypePlugins: [rehypeHighlight],
      }),
      rezact(),
      rezact_mdx(),
      dts({ rollupTypes: true }),
    ],
  };
  if (mode === "production") {
    config.esbuild = {
      drop: ["console", "debugger"],
    };
  }
  return config;
});
