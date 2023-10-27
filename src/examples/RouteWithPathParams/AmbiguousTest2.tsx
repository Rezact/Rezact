import { MyLayout } from "../Layout/nestedLayout";

export default function ({ router }) {
  return (
    <>
      <h1>Ambiguous Test 2</h1>
      <p>ID: {router.params.id}</p>
    </>
  );
}

export const Layout = MyLayout;
