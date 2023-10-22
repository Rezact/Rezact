import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../SimpleStringListState/SimpleStringList";

export default function ({ routeParams }) {
  return (
    <>
      <h1>4. Users ID Settings Wild Card</h1>
      <Page />
      <p>ID: {routeParams.id}</p>
      <Page />
    </>
  );
}

export const Layout = MyLayout;
