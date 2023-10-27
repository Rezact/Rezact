import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../DataFetching/DataFetching";

export default function Users({ router }) {
  return (
    <div id="nested-routes-test-id">
      <h1>1. Users START</h1>
      <p>ID: {router.params.id || "No User Selected"}</p>
      <Page />
      {router.outlet}
      <Page />
      <p>1. Users END</p>
    </div>
  );
}

Users.Layout = MyLayout;

export const Layout = MyLayout;
