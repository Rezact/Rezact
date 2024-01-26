import { rezact } from "./vite-plugin.js";
import { rezact_mdx } from "./vite-mdx-plugin.js";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeHighlight from "rehype-highlight";
import mdx from "@mdx-js/rollup";
import { addRoutesToInput, rezactBuild } from "./vite-build-plugin.js";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: {
    alias: {
      src: "/src",
      rezact: "@rezact/rezact",
    },
  },
  build: {
    target: "esnext",
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {},
  },
  esbuild: {
    jsxFactory: "xCreateElement",
    jsxFragment: "xFragment",
  },
  plugins: [],
});

export function configRezact({ routes, options }) {
  const useMdx = options?.useMdx ?? true;
  if (!config.plugins) config.plugins = [];

  if (useMdx)
    config.plugins.push(
      mdx({
        pragma: "r.xCreateElement",
        pragmaFrag: "r.xFragment",
        jsxRuntime: "classic",
        pragmaImportSource: "@rezact/rezact/mdx",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "fm" }],
        ],
        rehypePlugins: [rehypeHighlight],
      })
    );

  config.plugins.push(rezact());

  if (useMdx) config.plugins.push(rezact_mdx());

  if (routes) {
    addRoutesToInput(routes, config);
    config.plugins.push(rezactBuild({ routes }));
  }

  return config;
}
