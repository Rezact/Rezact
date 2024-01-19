// do not move this data to another file, having it in its own file is part of a test case that is subtle
// importing this data into the Todos.tsx file would have caused a failure until
// the following fix was implemented in the vite.plugin.ts

// const hasMapDecl =
// mapDeclarationTracking[node.init?.callee?.object?.name] ||
// ["filter", "map", "reduce"].includes(
//   node.init?.callee?.property?.name
// );

export let $todos: any = [
  { $text: "Learn Rezact", $completed: false },
  { $text: "Learn TypeScript", $completed: true },
  { $text: "Build something awesome", $completed: false },
];
