import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../DataFetching/DataFetching";

export default function ({ routeParams, router_outlet }) {
  return (
    <div id="nested-routes-test-id">
      <h1>1. Users START</h1>
      <p>ID: {routeParams.id || "No User Selected"}</p>
      <Page />
      {router_outlet}
      <Page />
      <p>1. Users END</p>
    </div>
  );
}

export const Layout = MyLayout;
