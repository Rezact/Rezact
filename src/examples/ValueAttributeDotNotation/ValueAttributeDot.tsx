import { MyLayout } from "../Layout/nestedLayout";

function NumInput(props) {
  return <input type="number" value={props.$count} />;
}

function NumInput2({ $count }) {
  return <input type="number" value={$count} />;
}

export function Page() {
  let $myCount = 10;

  return (
    <>
      <h1>Input Value Attribute Passed with dot notation</h1>
      <NumInput $count={$myCount} />
      <NumInput2 $count={$myCount} />
      <p id="count-value">{$myCount}</p>
    </>
  );
}

// export const Layout = MyLayout;
