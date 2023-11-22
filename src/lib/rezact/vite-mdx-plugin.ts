import { PluginOption } from "vite";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import importAssertions from "acorn-import-assertions";
import * as walk from "acorn-walk";
import MagicString from "magic-string";

const acorn = Parser.extend(jsx(), importAssertions());

let src = "";
let componentScript = "";
let magicString: any = null;

function compileRezact(ast) {
  walk.ancestor(ast, {
    ExportNamedDeclaration(node: any) {
      if (
        !node.declaration ||
        !node.declaration.type ||
        !node.declaration.id ||
        node.declaration.id.name !== "componentScript" ||
        node.declaration.type !== "FunctionDeclaration"
      )
        return;
      // const test = compileRezact(node.declaration);
      // console.log(test);
      componentScript = src.substring(
        node.declaration.body.start + 1,
        node.declaration.body.end - 1
      );

      magicString.overwrite(node.start, node.end, "");
    },

    FunctionDeclaration(node: any) {
      if (node.id.name !== "_createMdxContent") return;
      magicString.appendRight(node.body.start + 1, componentScript);
      // console.log(node);
    },
  });
}

function rezact_mdx(): PluginOption {
  return {
    name: "transform-rezact-mdx",
    // enforce: "pre",
    transform(_src, id) {
      const supportedFileTypes = [".mdx"];
      if (supportedFileTypes.find((sf) => id.includes(sf)) === undefined)
        return;
      if (id.includes("node_modules")) return;
      if (id.includes("rezact/index.ts")) return;
      if (id.includes("rezact/vite-plugin.ts")) return;
      if (id.includes("rezact/vite-mdx-plugin.ts")) return;
      if (id.includes("rezact/mdx.ts")) return;
      if (id.includes("rezact/router.ts")) return;
      if (id.includes("signals.ts")) return;
      if (id.includes("mapState.ts")) return;
      src = _src;
      // console.log(id);
      magicString = new MagicString(src);
      const ast = acorn.parse(src, {
        locations: true,
        ecmaVersion: "latest",
        sourceType: "module",
      });
      compileRezact(ast);

      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true }),
      };
    },
  };
}

export { rezact_mdx };
