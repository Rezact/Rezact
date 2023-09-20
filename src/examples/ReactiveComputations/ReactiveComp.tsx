import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
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
    </>
  );
}

export const Layout = MyLayout;
