import { MyLayout } from "../Layout/nestedLayout";

export default function ({ router }) {
  return (
    <>
      <h1>Ambiguous Test 1</h1>
      <p>ID: {router.params.id}</p>
    </>
  );
}

export const Layout = MyLayout;
