import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Inspect from "vite-plugin-inspect";
import { rezact } from "./src/lib/rezact/rezact-plugin";
import { rezact_mdx } from "./src/lib/rezact/rezact-mdx-plugin";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeHighlight from "rehype-highlight";
import mdx from "@mdx-js/rollup";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  // console.log({ command, mode, ssrBuild, example: process.env.example });

  const config: any = {
    test: {
      global: true,
      environment: "happy-dom",
    },
    resolve: {
      alias: {
        src: "/src",
      },
    },
    build: {
      emptyOutDir: false,
      target: "esnext",
      modulePreload: {
        polyfill: false,
      },
      minify: true,
    },
    plugins: [
      Inspect(),
      mdx({
        pragma: "r.xCreateElement",
        pragmaFrag: "r.xFragment",
        jsxRuntime: "classic",
        pragmaImportSource: "src/lib/rezact/rezact-mdx",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "fm" }],
        ],
        rehypePlugins: [rehypeHighlight],
      }),
      rezact(),
      rezact_mdx()
    ],
  };
  if (mode === "production") {
    config.esbuild = {
      drop: ["console", "debugger"],
    };
  }
  return config;
});
