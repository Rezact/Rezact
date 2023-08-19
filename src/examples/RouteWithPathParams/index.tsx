// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

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
