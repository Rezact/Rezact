import { xCreateElement, xFragment } from "src/lib/rezact/rezact";
import { MyLayout } from "../Layout/layout";

export default function (props) {
  console.log(props);
  return (
    <>
      <h1>Path Params Test</h1>
      <p>ID: {props.routeParams.id}</p>
      <p>Test Param: {props.routeParams.test}</p>
    </>
  );
}

export const Layout = MyLayout;
