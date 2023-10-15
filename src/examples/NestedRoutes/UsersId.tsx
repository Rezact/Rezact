import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams, router_outlet }) {
  return (
    <>
      <h1>2. Users ID START</h1>
      <p>ID: {routeParams.id}</p>
      {router_outlet}
      <p>2. Users ID END</p>
    </>
  );
}

export const Layout = MyLayout;
