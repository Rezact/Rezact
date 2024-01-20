// do not move this data to another file, having it in its own file is part of a test case that is subtle
// importing this data into the Todos.tsx file would have caused a failure until
// the following fix was implemented in the vite.plugin.ts

// import { mapEffect } from "src/lib/rezact/mapState";

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

// the nonsense below is currently needed in order to
// support getting the nested
// subscribers to propogate all the way down to the dependent signals
// the reason is that currently maps need to be output to the DOM
// because the current subscribeToNestedStates function in mapState.ts
// will not subscribe if there is not a DOM node to attach to.

// This is largely due to the fact that rezact is currently
// running a garbage collection over current subscriptions
// and if the element reference is not in the DOM, it will
// remove the subscription

// there are ways to subscribe to a signal without having to
// attach it to the DOM, but that requires the user to manually
// subscribe to the signal and then manually unsubscribe

// additionally, there is an impact on the way the downstream components
// need to be written in order to support this
// the downstream Todo List component filters this list which
// sets up a new array of filtered todos (which is also a Signal/Map)
// and if you don't attach the base $todos to the DOM, then the
// filtered list loses some functionality when updating items directly in the
// todo list because of above mentioned issue with nested subscriptions

// if you opt out of this you need to make some changes to the code
// in the TodoList component to get the filtering to work properly
// and you will need to most likely call $todos.refresh in some places
// to get everything working.

const test = (
  <div>
    {$todos.map(($todo, $idx) => (
      <div>
        {$idx} {$todo.$text} {$todo.$completed}
      </div>
    ))}
  </div>
);

document.body.appendChild(test);
