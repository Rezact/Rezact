import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../SimpleStringListState/SimpleStringList";

export default function ({ router }) {
  return (
    <>
      <h1>4. Users ID Settings Wild Card</h1>
      <Page />
      <p>ID: {router.params.id}</p>
      <Page />
    </>
  );
}

export const Layout = MyLayout;
