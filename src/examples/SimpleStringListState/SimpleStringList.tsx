// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  let $test = ["Jack", "Jill", "John", "Jane"];
  return (
    <>
      <h1>Simple String List</h1>

      {$test.map(($name) => (
        <div dataVal={$name}>
          <input value={$name} />
        </div>
      ))}
      {$test.map(($name) => (
        <div>{$name}</div>
      ))}
    </>
  );
}

export const Layout = MyLayout;
