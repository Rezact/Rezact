// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
      <Button />
      <Button />
      <Button />
      <Button />
      <Button />
      <Button />
      <Button />
      <Button />
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
