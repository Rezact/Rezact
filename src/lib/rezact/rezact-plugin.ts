import { PluginOption } from "vite";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import * as walk from "acorn-walk";
import MagicString from "magic-string";

const acorn = Parser.extend(jsx());

let src = "";
let magicString: any = null;
let lastImport: any = null;
let importsUsed: any = {};
let signalsUsed: any = {};
let mapStateUsed: any = {};
let functionsToRun: any = [];

function wrapInUseSignal(node) {
  signalsUsed.BaseState = true;
  magicString.appendLeft(node.start, `new BaseState(`);
  magicString.appendRight(node.end, `)`);
}

function wrapInUseMapState(node) {
  mapStateUsed.MapState = true;
  magicString.appendLeft(node.start, `new MapState(`);
  magicString.appendRight(node.end, `)`);
}

function findDependencies(node, excludeDeps = {}) {
  const assignments: any = { ...excludeDeps };
  const identifiers: any = {};
  walk.simple(node, {
    AssignmentExpression(node: any) {
      if (node.left.name && node.left.name[0] !== "$") return;
      assignments[node.left.name] = true;
    },

    UpdateExpression(node: any) {
      if (node.argument.name && node.argument.name[0] !== "$") return;
      assignments[node.argument.name] = true;
    },

    Identifier(node: any) {
      if (node.name && node.name[0] !== "$") return;
      identifiers[node.name] = true;
    },
  });
  const ids = Object.keys(identifiers);
  const assigns = Object.keys(assignments);
  return ids.filter((id) => !assigns.includes(id));
}

function wrapInCreateComputed(node, explicitDeps = null, excludeDeps = {}) {
  const deps = explicitDeps || findDependencies(node, excludeDeps);
  if (deps.length === 0) return;
  signalsUsed.createComputed = true;
  magicString.appendLeft(
    node.start,
    `createComputed(([${deps.join(",")}]) => `
  );
  magicString.appendRight(node.end, `, [${deps.join(",")}])`);
}

function wrapInCreateComputedAttribute(
  node,
  explicitDeps = null,
  excludeDeps = {}
) {
  const deps = explicitDeps || findDependencies(node, excludeDeps);
  if (deps.length === 0) return;
  signalsUsed.createComputedAttribute = true;
  magicString.appendLeft(
    node.start,
    `createComputedAttribute(([${deps.join(",")}]) => `
  );
  magicString.appendRight(node.end, `, [${deps.join(",")}])`);
}

function wrapInCreateMapped(node, explicitDeps = null, excludeDeps = {}) {
  mapStateUsed.createMapped = true;
  const deps = explicitDeps || findDependencies(node, excludeDeps);
  if (deps.length === 0) return;
  signalsUsed.createComputed = true;
  magicString.appendLeft(node.start, `createMapped(([${deps.join(",")}]) => `);
  magicString.appendRight(node.end, `, [${deps.join(",")}])`);
}

function tackOnDotVee(node) {
  magicString.appendRight(node.end, `.getValue()`);
}

function hasAncestor(ancestors, type) {
  return ancestors.map((a) => a.type).indexOf(type) > -1;
}

function inFunction(ancestors, funcName) {
  for (let i = ancestors.length - 1; i > -1; i--) {
    const anc = ancestors[i];
    if (anc.type === "CallExpression" && anc.callee.name === funcName)
      return anc;
  }
  return false;
}

function isAttributeArg(ancestors) {
  const func = inFunction(ancestors, "xCreateElement");
  if (!func) return false;
  let arg = null;
  for (let i = ancestors.length - 1; i > -1; i--) {
    const anc = ancestors[i];
    if (anc.type === "ObjectExpression") {
      arg = anc;
      break;
    }
  }
  if (func.arguments[1] === arg) return true;
  return false;
}

function wrapInSetValue(node, nestedMember = false) {
  if (nestedMember) {
    const left = src.slice(node.left.start, node.left.end);
    const right = src.slice(node.right.start, node.right.end);

    const backupMagicString = magicString;
    const backupMagicSrc = src;
    const leftAst = acorn.parse(left, {
      locations: true,
      ecmaVersion: "latest",
      sourceType: "module",
    });
    src = left;
    magicString = new MagicString(left);
    compileRezact(leftAst);
    const leftParsed = magicString.toString();
    const leftMinusValue =
      leftParsed.slice(-11) === ".getValue()"
        ? leftParsed.slice(0, leftParsed.length - 11)
        : leftParsed;

    magicString = backupMagicString;
    src = backupMagicSrc;

    let nestedRightVal = right || "";
    if (node.operator === "+=") nestedRightVal = `${leftParsed} + ${right}`;
    magicString.overwrite(
      node.start,
      node.end,
      `${leftMinusValue}.setValue(${nestedRightVal})`
    );
    return;
  }

  const leftVal = node.left?.name || node.argument?.name;
  let rightVal =
    node.right?.raw || src.slice(node.right?.start || 0, node.right?.end || 0);
  if (node.right?.value && node.right.value[0] === "$")
    rightVal = `${node.right.value}.getValue()`;

  const operation =
    node.operator === "++" ? "+ 1" : node.operator === "--" ? "- 1" : "";

  if (
    node.argument &&
    node.type === "UpdateExpression" &&
    node.argument.name[0] === "$"
  )
    rightVal = `${node.argument.name}.getValue() ${operation}`;

  if (
    node.right?.type === "UnaryExpression" &&
    node.right.argument.name[0] === "$"
  )
    rightVal = `${node.right.operator}${node.right.argument.name}.getValue()`;

  magicString.overwrite(
    node.start,
    node.end,
    `${leftVal}.setValue(${rightVal})`
  );
}

const arrProps = ["push", "pop", "splice", "shift", "unshift"];

function compileRezact(ast) {
  walk.ancestor(ast, {
    VariableDeclarator(node: any, _state) {
      const name = node.id.name;
      if (!name) return;
      if (name[0] === "$") {
        if (node.init.type === "Literal") wrapInUseSignal(node.init);
        if (node.init.type === "UnaryExpression") wrapInUseSignal(node.init);
        if (node.init.type === "ArrayExpression") wrapInUseMapState(node.init);
        if (node.init.type === "CallExpression")
          wrapInCreateComputed(node.init);
      }
    },

    TemplateLiteral(node: any, _state, ancestors) {
      if (isAttributeArg(ancestors)) {
        wrapInCreateComputedAttribute(node);
      } else {
        wrapInCreateComputed(node);
      }
    },

    UnaryExpression(node: any) {
      if (!node?.argument?.name) return;
      if (node.argument.name[0] === "$") {
      }
    },

    LogicalExpression(node: any, _state, ancestors: any) {
      if (node.left.type === "Identifier" && node.left.name[0] === "$") {
        tackOnDotVee(node.left);
      }

      const lastAncestor = ancestors.at(-1);
      const logicalExprAncestor = ancestors.find(
        (anc) =>
          anc.type === "LogicalExpression" ||
          anc.type === "ConditionalExpression"
      );

      if (
        logicalExprAncestor !== undefined &&
        logicalExprAncestor !== lastAncestor
      )
        return;

      const explicitDeps = findDependencies(node.left);
      wrapInCreateComputed(node, explicitDeps);
    },

    MemberExpression(node: any, _state, ancestors: any) {
      const propertyExcludeList = ["toJson", "map", "deleteValue", ...arrProps];
      let isInAssignment = false;
      let anceLen = ancestors.length - 1;
      while (anceLen > -1) {
        if (ancestors[anceLen].type === "MemberExpression") {
          anceLen--;
          continue;
        }
        if (ancestors[anceLen].type === "AssignmentExpression") {
          isInAssignment = true;
          break;
        }
        break;
      }

      if (!node.property || !node.property.type || !node.property.name) return;

      if (
        node.object.type === "Identifier" &&
        node.object.name[0] === "$" &&
        node.property.type === "Identifier" &&
        node.property.name[0] === "$"
      ) {
        tackOnDotVee(node.object);
      } else if (
        node.property.type === "Identifier" &&
        node.property.name[0] === "$"
      ) {
        if (
          ancestors.length > 2 &&
          ancestors.at(-2).callee?.property?.name === "xCreateElement"
        )
          return;
        if (
          ancestors.length > 2 &&
          ancestors.at(-2).callee?.name === "xCreateElement"
        )
          return;
        if (isInAssignment)
          return wrapInSetValue(ancestors[anceLen], node.property);
        tackOnDotVee(node.property);
      } else if (
        node.object.name &&
        node.object.name[0] === "$" &&
        !propertyExcludeList.includes(node.property.name)
      ) {
        tackOnDotVee(node.object);
        if (node.computed) tackOnDotVee(node);
      }
    },

    CallExpression(node: any) {
      if (node.arguments) {
        node.arguments.forEach((arg) => {
          if (
            arg.type === "Identifier" &&
            arg.name[0] === "$" &&
            node.callee?.object?.name === "console" &&
            node.callee?.property?.name === "log"
          ) {
            tackOnDotVee(arg);
          } else if (
            node.callee.type === "MemberExpression" &&
            arrProps.includes(node.callee.property.name) &&
            arg.type === "Identifier" &&
            arg.name[0] === "$"
          ) {
            tackOnDotVee(arg);
          }
        });
      }
      if (
        node.callee.type === "MemberExpression" &&
        node.callee.object.type === "Identifier" &&
        node.callee.object.name[0] === "$" &&
        node.callee.property.name === "map"
      ) {
        magicString.overwrite(
          node.callee.property.start,
          node.callee.property.end,
          "Map"
        );
        wrapInCreateMapped(node, [node.callee.object.name]);
      }
    },

    Identifier(_node: any, _state) {
      if (_node.name === "onMount") {
        importsUsed.useCustomElementsForMountCallbacks = true;
        functionsToRun.push("useCustomElementsForMountCallbacks()");
      }
      if (_node.name === "onUnmount") {
        importsUsed.useCustomElementsForMountCallbacks = true;
        functionsToRun.push("useCustomElementsForMountCallbacks()");
      }
    },

    Property(node: any, _state) {
      if (node.key.name === "className") {
        magicString.overwrite(node.key.start, node.key.end, "class");
      }
      if (node.key.name && node.key.name[0] === "$") {
        wrapInUseSignal(node.value);
      }
      if (node.key.value && node.key.value[0] === "$") {
        wrapInUseSignal(node.value);
      }
      if (node.key.name === "value" && !importsUsed.useInputs)
        importsUsed.useInputs = true && functionsToRun.push("useInputs()");
    },

    ConditionalExpression(node: any, _state, ancestors: any) {
      if (
        isAttributeArg(ancestors) &&
        !hasAncestor(ancestors, "TemplateLiteral")
      ) {
        wrapInCreateComputedAttribute(node);
      } else if (!hasAncestor(ancestors, "TemplateLiteral")) {
        wrapInCreateComputed(node);
      }
      if (!node?.test?.name) return;
      if (node.test.name && node.test.name[0] === "$") {
        tackOnDotVee(node.test);
      }
    },

    ImportDeclaration(node: any) {
      lastImport = node;
    },

    BinaryExpression(node: any) {
      const name = node.left.name;
      if (name && name[0] === "$") {
        tackOnDotVee(node.left);
      }
    },

    UpdateExpression(node: any, _state) {
      const name = node.argument.name;
      if (!name) return;
      if (name[0] === "$") {
        wrapInSetValue(node);
      }
    },

    AssignmentExpression(node: any, _state) {
      const name = node.left.name;
      if (!name) return;
      if (name[0] === "$") {
        wrapInSetValue(node);
      }
    },

    LabeledStatement(node: any) {
      if (node.label.name === "$") {
        if (node.body.type === "BlockStatement")
          wrapInCreateComputed(node.body);
        if (node.body.type === "ExpressionStatement")
          wrapInCreateComputed(node.body.expression);
      }
    },
  });
}

function rezact(): PluginOption {
  return {
    name: "transform-rezact",
    // enforce: "pre",
    transform(_src, id) {
      const supportedFileTypes = [".tsx", ".jsx", ".ts", ".js", ".mdx"];
      if (supportedFileTypes.find((sf) => id.includes(sf)) === undefined)
        return;
      if (id.includes("node_modules")) return;
      if (id.includes("rezact.ts")) return;
      if (id.includes("signals.ts")) return;
      if (id.includes("mapState.ts")) return;
      src = _src;
      magicString = null;
      lastImport = null;
      importsUsed = {};
      functionsToRun = [];
      // console.log(id);
      magicString = new MagicString(src);
      const ast = acorn.parse(src, {
        locations: true,
        ecmaVersion: "latest",
        sourceType: "module",
      });
      compileRezact(ast);
      const importsUsedArr = Object.keys(importsUsed);
      if (importsUsedArr.length > 0)
        magicString.prepend(
          `import {${importsUsedArr.join(",")}} from "src/lib/rezact/rezact"\n`
        );

      const signalsUsedArr = Object.keys(signalsUsed);
      if (signalsUsedArr.length > 0)
        magicString.prepend(
          `import {${signalsUsedArr.join(",")}} from "src/lib/rezact/signals"\n`
        );

      const mapStateUsedArr = Object.keys(mapStateUsed);
      if (mapStateUsedArr.length > 0)
        magicString.prepend(
          `import {${mapStateUsedArr.join(
            ","
          )}} from "src/lib/rezact/mapState"\n`
        );

      if (lastImport)
        magicString.appendRight(
          lastImport.end,
          `\n${functionsToRun.join("\n")}`
        );
      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true }),
      };
    },
  };
}

export { rezact };
