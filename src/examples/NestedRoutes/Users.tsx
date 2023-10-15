import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams, router_outlet }) {
  return (
    <div id="nested-routes-test-id">
      <h1>1. Users START</h1>
      <p>ID: {routeParams.id || "No User Selected"}</p>
      {router_outlet}
      <p>1. Users END</p>
    </div>
  );
}

export const Layout = MyLayout;
