import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams, router_outlet }) {
  return (
    <>
      <h1>Users ID</h1>
      <p>ID: {routeParams.id}</p>
      {/* {router_outlet} */}
    </>
  );
}

export const Layout = MyLayout;
