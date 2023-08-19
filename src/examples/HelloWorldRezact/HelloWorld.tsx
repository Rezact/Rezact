import { xCreateElement, xFragment } from "src/lib/rezact/rezact";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  return (
    <>
      <h1>Hello World</h1>
    </>
  );
}

export const Layout = MyLayout;
