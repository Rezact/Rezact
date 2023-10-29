import { MyLayout } from "../examples/Layout/nestedLayout";

export function Page() {
  return (
    <>
      <h1>404 - Page Not Found</h1>
    </>
  );
}

Page.Layout = MyLayout;
export const Layout = MyLayout;
