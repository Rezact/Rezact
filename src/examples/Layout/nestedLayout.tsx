import { routerProp } from "src/lib/rezact/router";
import { MasterLayout } from "./masterLayout";

export function MyLayout({ router }: routerProp) {
  const { $route } = router;
  return (
    <MasterLayout>
      <h1 id="testing-hashroute">Layout</h1>
      <ul>
        <li class={$route === "/" ? "active" : ""}>
          <a href="/">Home</a>
        </li>
        <li
          class={
            $route === "/array-state-persistent-across-route-changes"
              ? "active"
              : ""
          }
        >
          <a href="/array-state-persistent-across-route-changes">
            Home (Persistent Toggle States)
          </a>
        </li>
        <li>
          <a href="/benchmark">Benchmark</a>
        </li>
        <li class={$route === "/hello-world" ? "active" : ""}>
          <a href="/hello-world">Hello World</a>
        </li>
        <li>
          <a href="/hello-world-multiple">Hello World Multiple</a>
        </li>
        <li>
          <a href="/nested">Nested Children</a>
        </li>
        <li class={$route === "/counter" ? "active" : ""}>
          <a href="/counter">Counter</a>
        </li>
        <li>
          <a href="/counter-multiple">Counter Multiple</a>
        </li>
        <li>
          <a href="/list">List</a>
        </li>
        <li class={$route === "/post/:id/something/:test" ? "active" : ""}>
          <a href="/post/asdf/something/qwer">Route Params</a>
        </li>
        <hr />
        <li>
          <a href="/payments/123">Ambiguous Route/Params 1</a>
        </li>
        <li>
          <a href="/payments/ach/321">Ambiguous Route/Params 2</a>
        </li>
        <li>
          <a href="/users">Nested Routes /users</a>
        </li>
        <li>
          <a href="/users/123">Nested Routes /users/:id</a>
        </li>
        <li>
          <a href="/users/123/settings">Nested Routes /users/:id/settings</a>
        </li>
        <li>
          <a href="/users2/123/settings/all/wild/card/stuff">
            Nested Routes /users/:id/settings/all/wild/card/stuff
          </a>
        </li>
        <hr />
        <li>
          <a href="/payments2/config123">
            CONFIG BASED - Ambiguous Route/Params 1
          </a>
        </li>
        <li>
          <a href="/payments2/ach/config321">
            CONFIG BASED - Ambiguous Route/Params 2
          </a>
        </li>
        <li>
          <a href="/users2">CONFIG BASED - Nested Routes /users</a>
        </li>
        <li>
          <a href="/users2/config123">
            CONFIG BASED - Nested Routes /users/:id
          </a>
        </li>
        <li>
          <a href="/users2/config1234/settings">
            CONFIG BASED - Nested Routes /users/:id/settings
          </a>
        </li>
        <li>
          <a href="/users2/config1235/settings/all/wild/card/stuff">
            CONFIG BASED - Nested Routes /users/:id/settings/all/wild/card/stuff
          </a>
        </li>
        <hr />

        <li>
          <a href="/users3">DIRECT COMPONENT - Nested Routes /users</a>
        </li>
        <li>
          <a href="/users3/direct123">
            DIRECT COMPONENT - Nested Routes /users/:id
          </a>
        </li>
        <li>
          <a href="/users3/direct1234/settings">
            DIRECT COMPONENT - Nested Routes /users/:id/settings
          </a>
        </li>
        <li>
          <a href="/users3/direct1235/settings/all/wild/card/stuff">
            DIRECT COMPONENT - Nested Routes
            /users/:id/settings/all/wild/card/stuff
          </a>
        </li>
        <hr />

        <li>
          <a href="/mdx">MDX</a>
        </li>
        <li>
          <a href="/uncontrolled-forms">Uncontrolled Forms and Controls</a>
        </li>
        <li>
          <a href="/controlled-forms">Controlled Forms and Controls</a>
        </li>
        <li>
          <a href="/shadow-dom">Shadow DOM Example</a>
        </li>
        <li>
          <a href="/data-fetching">Data Fetching</a>
        </li>
        <li>
          <a href="/todos">Todos</a>
        </li>
        <li>
          <a href="/reactive-computations">Reactive Computations</a>
        </li>
        <li>
          <a href="/store-test">Store Test</a>
        </li>
        <li>
          <a href="/list-redraw">List Redraw</a>
        </li>
        <li>
          <a href="/simple-string-list">Simple String List</a>
        </li>
        <li>
          <a href="/escape-hatches">Escape Hatches (Progressive Exposure)</a>
        </li>
        <li>
          <a href="/form-validation">Form Validator</a>
        </li>
        <li>
          <a href="/value-attribute-dot-notation">
            Input Value Attribute passed with Dot Notation
          </a>
        </li>
        <li>
          <a href="/component-context">Component Context</a>
        </li>
        <li>
          <a href="/jsx-signals">JSX Signals</a>
        </li>
        <li>
          <a href="/onBeforeLeave">On Before Leave Test</a>
        </li>
        <li>
          <a href="/portals">Portals</a>
        </li>
        <li>
          <a href="/asdfasdfasdfasdf">A Route that does not exist</a>
        </li>

        <hr />

        <li>
          <a href="#testing-hashroute">Hashtag route</a>
        </li>
      </ul>
      <button onClick={() => router.back()}>Back</button>
      <button onClick={() => router.forward()}>Forward</button>
      <button onClick={() => router.go(-1)}>Go -1</button>
      <button onClick={() => router.go(1)}>Go 1</button>
      <button onClick={() => router.push("/testing-push")}>Push State</button>
      <button onClick={() => router.replace("/testing-replace")}>
        Replace State
      </button>

      <div id="router-outlet-test">{router.outlet}</div>
      <p>End Layout</p>
      <div id="portal-out"></div>
    </MasterLayout>
  );
}
