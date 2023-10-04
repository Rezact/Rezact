import { MyLayout } from "../Layout/nestedLayout";
import { Issue14 } from "./Issue14";
import Issue22 from "./Issue22";

export default function App() {
  let $count = 0;
  let $doubled = $count * 2;

  const inc = () => {
    $count++;
    console.log($count, $doubled);
  };
  return (
    <>
      <h1>Hello World</h1>
      <p>{$count}</p>
      <p>{$doubled}</p>
      <button onClick={inc}>Inc</button>
      <hr />
      <ComposeTest />
      <hr />
      <Issue14 />
      <hr />
      <Issue22 />
    </>
  );
}

function ComposeTest() {
  let $count = 0;

  function updateState($x, y) {
    $x += y;
  }

  function updateState2($x, y) {
    // testing the other Assignment variation
    $x = $x + y;
  }

  return (
    <>
      <button type="button" onClick={() => ($count += 1)}>
        {$count}
      </button>

      <button type="button" onClick={() => updateState($count, 1)}>
        {$count}
      </button>

      <button type="button" onClick={() => updateState2($count, 2)}>
        {$count}
      </button>
    </>
  );
}

export const Layout = MyLayout;
