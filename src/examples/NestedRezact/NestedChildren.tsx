import { xCreateElement, xFragment } from "src/lib/rezact/rezact";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  return (
    <>
      <h1>Hello World</h1>
      <TestChildren>
        <li>Child One</li>
        <li>Child Two</li>
        <li>Child Three</li>
      </TestChildren>
    </>
  );
}

function TestChildren(props) {
  return <ul>{props.children}</ul>;
}

export const Layout = MyLayout;
