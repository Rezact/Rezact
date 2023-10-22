import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../SimpleStringListState/SimpleStringList";

export default function ({ routeParams, router_outlet }) {
  return (
    <>
      <h1>2. Users ID START</h1>
      <p>ID: {routeParams.id}</p>
      <Page />
      {router_outlet}
      <Page />
      <p>2. Users ID END</p>
    </>
  );
}

export const Layout = MyLayout;
