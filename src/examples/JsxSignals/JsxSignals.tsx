import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  let $elmRef = <p>Test Signal Element</p>;
  const change = () => ($elmRef = <p>Changed Signal Element</p>);

  let elm1 = <p>Elm 1</p>;
  let elm2 = <p>Elm 2</p>;
  let elm3 = <p>Elm 3</p>;
  let elm4 = <p>Elm 4</p>;
  let $elmRef2 = elm1;
  let $elmRef3 = elm3;

  const change2 = () => ($elmRef2 = $elmRef2 === elm1 ? elm2 : elm1);

  const change3 = () => {
    if ($elmRef3 === elm3) {
      $elmRef3 = elm4;
    } else {
      $elmRef3 = elm3;
    }
  };

  return (
    <>
      <h1>JSX Signals</h1>
      {$elmRef}
      <button onClick={change}>Change 1</button>

      <hr />
      {$elmRef2}
      <button onClick={change2}>Change 2</button>

      <hr />
      {$elmRef3}
      <button onClick={change3}>Change 3</button>
    </>
  );
}

export const Layout = MyLayout;
