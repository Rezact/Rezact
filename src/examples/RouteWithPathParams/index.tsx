// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

export default function (props) {
  return (
    <>
      <h1>Path Params Test</h1>
      <p>ID: {props.router.params.id}</p>
      <p>Test Param: {props.router.params.test}</p>
    </>
  );
}

export const Layout = MyLayout;
