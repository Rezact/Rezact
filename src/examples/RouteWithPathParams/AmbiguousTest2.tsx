import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams }) {
  return (
    <>
      <h1>Ambiguous Test 2</h1>
      <p>ID: {routeParams.id}</p>
    </>
  );
}

export const Layout = MyLayout;
