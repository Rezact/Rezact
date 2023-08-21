// import { xCreateElement } from "src/lib/rezact";
import { MasterLayout } from "./masterLayout";

export function MyLayout({ Component, pageProps }: any) {
  return (
    <MasterLayout>
      <h1>Layout</h1>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/array-state-persistent-across-route-changes">
            Home (Persistent Toggle States)
          </a>
        </li>
        <li>
          <a href="/benchmark">Benchmark</a>
        </li>
        <li>
          <a href="/hello-world">Hello World</a>
        </li>
        <li>
          <a href="/hello-world-multiple">Hello World Multiple</a>
        </li>
        <li>
          <a href="/nested">Nested Children</a>
        </li>
        <li>
          <a href="/counter">Counter</a>
        </li>
        <li>
          <a href="/counter-multiple">Counter Multiple</a>
        </li>
        <li>
          <a href="/list">List</a>
        </li>
        <li>
          <a href="/post/asdf/something/qwer">Route Params</a>
        </li>
      </ul>
      <Component {...pageProps} />
    </MasterLayout>
  );
}
