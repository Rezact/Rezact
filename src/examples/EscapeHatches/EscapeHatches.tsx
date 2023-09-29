import { MyLayout } from "../Layout/nestedLayout";
import { TestManual } from "./TestManual";

export function Page() {
  return (
    <>
      <h1>Hello World</h1>
      <TestManual />
    </>
  );
}

export const Layout = MyLayout;
