// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
      <Clock />
    </>
  );
}

function Clock() {
  let $count = 0;

  const timer = setInterval(() => $count++, 1000);
  const unmount = () => clearInterval(timer);

  return <h1 onUnmount={unmount}>{$count}</h1>;
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
