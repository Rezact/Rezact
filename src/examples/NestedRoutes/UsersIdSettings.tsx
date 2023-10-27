import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../DataFetching/DataFetching";

export default function ({ router }) {
  (window as any).testValues.UsersSettings = router.meta;
  return (
    <div>
      <h1>3. Users ID Settings START</h1>
      <p>ID: {router.params.id}</p>
      <Page />
      {router.outlet}
      <Page />
      <p>3. Users ID Settings END</p>
    </div>
  );
}

export const Layout = MyLayout;
