import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams, router_outlet }) {
  console.log("asdf", router_outlet);
  let $test = <span>test</span>;
  return (
    <>
      <h1>Users</h1>
      <p>ID: {routeParams.id || "No User Selected"}</p>
      {/* {router_outlet} */}
      {$test}
    </>
  );
}

export const Layout = MyLayout;
