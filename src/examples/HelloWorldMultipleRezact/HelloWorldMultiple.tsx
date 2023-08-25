// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

function HelloWorld() {
  return <h1 disabled={true}>Hello World</h1>;
}

export function Page() {
  const node = <HelloWorld />;
  const nodeArr = [<HelloWorld />, <HelloWorld />, <HelloWorld />];
  return (
    <>
      <HelloWorld />
      <HelloWorld />
      <HelloWorld />
      <HelloWorld />
      <span>{node}</span>
      <span>{nodeArr}</span>
      <HelloWorld />
      <HelloWorld />
    </>
  );
}

export const Layout = MyLayout;
