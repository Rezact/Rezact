// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

export default function ({ router }) {
  let { $id, $test } = router.params;
  return (
    <>
      <h1>Path Params Test</h1>
      <p>ID: {$id}</p>
      <p>Test Param: {$test}</p>
      <button onClick={() => ($id = "test1id")}>Test 1</button>
      <button onClick={() => ($test = "test2test")}>Test 2</button>
      <button onClick={() => ($id = "test3id")}>Test 3</button>
      <button onClick={() => ($test = "test4test")}>Test 4</button>
    </>
  );
}

export const Layout = MyLayout;
