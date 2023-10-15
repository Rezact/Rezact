import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams, router_outlet }) {
  // console.log("asdf", router_outlet);
  return (
    <>
      <h1>Users ID Settings</h1>
      <p>ID: {routeParams.id}</p>
      {router_outlet}
    </>
  );
}

export const Layout = MyLayout;
