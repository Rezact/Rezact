import { MyLayout } from "../Layout/nestedLayout";

export default function ({ router }) {
  let { $id } = router.params;
  return (
    <>
      <h1>Ambiguous Test 1</h1>
      <p>ID: {$id}</p>
      <button
        onClick={() => {
          $id = "test";
        }}
      >
        Test
      </button>
    </>
  );
}

export const Layout = MyLayout;
