import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../SimpleStringListState/SimpleStringList";

export default function ({ router }) {
  (window as any).testValues.UsersID = router.meta;
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
