import { dirname, resolve } from "path";
import * as fs from "fs";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
// import { BrowserWindow } from "@happy-dom/global-registrator/node_modules/happy-dom/lib/window/BrowserWindow";
import { fileURLToPath } from "url";
import { Buffer as MyBuffer } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).replace(
  "/node_modules/@rezact/rezact",
  ""
);

export function writeToFileSync(filePath, content) {
  fs.mkdirSync(dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

export async function rezactRendered() {
  return new Promise((resolve) => {
    const renderedFunc = (e) => {
      document.removeEventListener("rezact-rendered", renderedFunc);
      resolve(e);
    };

    document.addEventListener("rezact-rendered", renderedFunc);
  });
}

export function addRoutesToInput(routes, config) {
  const isBuild = process.env.npm_lifecycle_event === "build";

  let rollupInput = { main: resolve(__dirname, "index.html") };
  if (isBuild) {
    const indexFilePath = resolve(__dirname, "index.html");
    const _idxFileText = fs.readFileSync(indexFilePath, "utf-8");

    const mappedRoutes = routes.map((route) => {
      const htmlFilePath = __dirname + route.path + ".html";
      if (route.path !== "/" && !route.path.includes(":")) {
        let idxFileText = _idxFileText;
        writeToFileSync(htmlFilePath, idxFileText);
        rollupInput[route.path.replace(/\//g, "")] = resolve(htmlFilePath);
      }
    });
  }

  config.build.rollupOptions.input = { ...rollupInput };
}

function deleteFileAndEmptyDirs(filePath) {
  // Delete the file
  fs.unlinkSync(filePath);

  // Recursively remove parent directories if empty
  let dirPath = dirname(filePath);
  while (dirPath !== resolve(dirPath, "..")) {
    if (fs.readdirSync(dirPath).length === 0) {
      fs.rmdirSync(dirPath);
      dirPath = resolve(dirPath, "..");
    } else {
      break;
    }
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function findAllNestedImports(filePath) {}

export function rezactBuild({ routes }) {
  return {
    name: "rezact-build",

    async writeBundle(options, bundle) {
      GlobalRegistrator.register({
        url: `http://localhost:5500/`,
      });
      globalThis.Buffer = MyBuffer;
      const { happyDOM } = window;
      window.scrollTo = () => {};
      document.body.innerHTML = `<div id="app"></div>`;
      const originalAppendChild = document.head.appendChild.bind(document.head);
      let routeSplitStyleSheets = [];
      document.head.appendChild = (link) => {
        if (link.rel !== "stylesheet") return originalAppendChild(link);
        routeSplitStyleSheets.push(link.outerHTML);
        // dispatch load event on link so that vite will continue, otherwise it will hang waiting for the load event forever
        setTimeout(() => {
          link.dispatchEvent(new Event("load"));
        }, 10);
      };

      let mainEntryJS = "";
      const bundleMapped = {};
      Object.keys(bundle).forEach((key) => {
        const path = bundle[key].moduleIds?.at(-1).replace(/\.(tsx|jsx)$/, "");
        if (path) bundleMapped[path] = bundle[key];
      });

      let mainModule = null;

      // convert this map into a for loop
      for (const route of routes) {
        console.log("rendering", route.path);
        const path = route.component.toString().split(/["'`]/)[1];
        const resolvedPath = resolve(__dirname, path);
        const htmlFilePath = __dirname + route.path + ".html";
        if (route.path !== "/" && !route.path.includes(":")) {
          deleteFileAndEmptyDirs(htmlFilePath);
        }

        const routeChunk = bundleMapped[resolvedPath];
        const routePathMapName = (route.path.slice(1) || "index") + ".html";
        let preloads = "";
        const dedupePreload = {};

        if (!routeChunk) {
          console.log("NO CHUNK FOR", resolvedPath);
          continue;
        }
        const preload = `<link rel="modulepreload" href="/${routeChunk.fileName}" />\n`;
        preloads += preload;
        routeChunk.imports.forEach((importPath) => {
          if (importPath.startsWith("assets/main-"))
            return (mainEntryJS = importPath);
          if (dedupePreload[importPath]) return;
          dedupePreload[importPath] = true;
          const preload = `<link rel="modulepreload" href="/${importPath}" />\n`;
          preloads += preload;
        });

        preloads += "<!-- LATE PRELOAD HERE -->";
        const _modifiedSource = bundle[routePathMapName].source.replace(
          "<!-- PRELOAD HERE -->",
          preloads
        );

        if (mainModule === null) {
          const fullMainPath = __dirname + "/dist/" + mainEntryJS;
          mainModule = await import(fullMainPath);
          await rezactRendered();
        } else {
          const anchor = document.createElement("a");
          anchor.href = route.path;
          document.body.appendChild(anchor);
          anchor.click();
          await rezactRendered();
          await delay(100);
        }

        preloads = routeSplitStyleSheets.join("\n");
        const _lateModifiedPreload = _modifiedSource.replace(
          "<!-- LATE PRELOAD HERE -->",
          preloads
        );
        routeSplitStyleSheets = [];

        const app = document.getElementById("app");
        const modifiedSource = _lateModifiedPreload.replace(
          "<!-- PRE RENDER HERE -->",
          app.innerHTML
        );

        const outRoutePath = route.path === "/" ? "/index" : route.path;
        const outputHtmlFilePath = __dirname + "/dist" + outRoutePath + ".html";

        writeToFileSync(outputHtmlFilePath, modifiedSource);
      }
      happyDOM.abort();
      GlobalRegistrator.unregister();
      // fs.writeFileSync("bundle.json", JSON.stringify(bundle, null, 2));
      return;
    },
  };
}
