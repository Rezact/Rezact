import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams, router_outlet }) {
  return (
    <>
      <h1>Users</h1>
      <p>ID: {routeParams.id || "No User Selected"}</p>
      {router_outlet}
    </>
  );
}

export const Layout = MyLayout;
