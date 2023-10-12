import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  let $elmRef = <p>Test Signal Element</p>;
  const change = () => ($elmRef = <p>Changed Signal Element</p>);

  const elm1 = <p>Elm 1</p>;
  const elm2 = <p>Elm 2</p>;
  const elm3 = <p>Elm 3</p>;
  const elm4 = <p>Elm 4</p>;

  const elm5and6 = (
    <>
      <p>Elm 5</p>
      <p>Elm 6</p>
    </>
  );

  const elm7and8 = (
    <>
      <p>Elm 7</p>
      <p>Elm 8</p>
    </>
  );

  const elm9 = <p>Elm 9</p>;
  const elm10and11 = (
    <>
      <p>Elm 10</p>
      <p>Elm 11</p>
    </>
  );

  const elm12and13 = (
    <>
      <p>Elm 12</p>
      <p>Elm 13</p>
    </>
  );

  const elm14 = <p>Elm 14</p>;

  let $elmRef2 = elm1;
  let $elmRef3 = elm3;
  let $elmRefArr = elm5and6;
  let $elmRefArr2 = elm9;
  let $elmRefArr3 = elm12and13;

  const change2 = () => ($elmRef2 = $elmRef2 === elm1 ? elm2 : elm1);

  const change3 = () => {
    if ($elmRef3 === elm3) {
      $elmRef3 = elm4;
    } else {
      $elmRef3 = elm3;
    }
  };

  const change4 = () =>
    ($elmRefArr = $elmRefArr === elm5and6 ? elm7and8 : elm5and6);

  const change5 = () =>
    ($elmRefArr2 = $elmRefArr2 === elm9 ? elm10and11 : elm9);
  const change6 = () =>
    ($elmRefArr3 = $elmRefArr3 === elm12and13 ? elm14 : elm12and13);

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

      <hr />
      {$elmRefArr}
      <button onClick={change4}>Change 4</button>

      <hr />
      {$elmRefArr2}
      <button onClick={change5}>Change 5</button>

      <hr />
      {$elmRefArr3}
      <button onClick={change6}>Change 6</button>
    </>
  );
}

export const Layout = MyLayout;
