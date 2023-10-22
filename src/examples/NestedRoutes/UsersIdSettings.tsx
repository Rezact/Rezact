import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../DataFetching/DataFetching";

export default function ({ routeParams, router_outlet }) {
  // console.log("asdf", router_outlet);
  return (
    <div>
      <h1>3. Users ID Settings START</h1>
      <p>ID: {routeParams.id}</p>
      <Page />
      {router_outlet}
      <Page />
      <p>3. Users ID Settings END</p>
    </div>
  );
}

export const Layout = MyLayout;
