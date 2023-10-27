import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../SimpleStringListState/SimpleStringList";

export default function ({ router }) {
  return (
    <>
      <h1>2. Users ID START</h1>
      <p>ID: {router.params.id}</p>
      <Page />
      {router.outlet}
      <Page />
      <p>2. Users ID END</p>
    </>
  );
}

export const Layout = MyLayout;
