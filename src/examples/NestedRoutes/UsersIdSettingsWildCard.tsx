import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../SimpleStringListState/SimpleStringList";

export default function ({ router }) {
  let { $rest } = router.params;
  return (
    <>
      <h1>4. Users ID Settings Wild Card</h1>
      <Page />
      <p>ID: {router.params.id}</p>
      <p>{$rest}</p>
      <button onClick={() => ($rest = "wqer/qwer/qwer")}>Test</button>
      <Page />
    </>
  );
}

export const Layout = MyLayout;
