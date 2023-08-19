import { xCreateElement, xFragment } from "src/lib/rezact/rezact";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  );
}

function Button() {
  let $count = 0;

  return (
    <button onClick={() => $count++}>
      Clicked {$count} {$count === 1 ? "time" : "times"}
    </button>
  );
}

export const Layout = MyLayout;
