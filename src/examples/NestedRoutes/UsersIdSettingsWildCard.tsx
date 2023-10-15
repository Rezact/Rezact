import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams }) {
  return (
    <>
      <h1>4. Users ID Settings Wild Card</h1>
      <p>ID: {routeParams.id}</p>
    </>
  );
}

export const Layout = MyLayout;
