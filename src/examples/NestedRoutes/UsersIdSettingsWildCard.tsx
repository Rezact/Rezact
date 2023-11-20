import { ErrorBoundary } from "src/lib/rezact/ErrorBoundary";
import { MyLayout } from "../Layout/nestedLayout";
import { Page } from "../SimpleStringListState/SimpleStringList";

export default function ({ router }) {
  (window as any).testValues.UsersCatchAll = router.meta;
  let { $rest } = router.params;
  return (
    <>
      <h1>4. Users ID Settings Wild Card</h1>
      <Page />
      <p>ID: {router.params.id}</p>
      <p>{$rest}</p>
      <button onClick={() => ($rest = "wqer/qwer/qwer")}>Test</button>
      <ErrorBoundary fallback={ErrorComp}>
        <ErrorTest router={router} />
      </ErrorBoundary>
      <Page />
    </>
  );
}

function ErrorTest({ router }) {
  if (router.pathname.includes("/error-test")) throw new Error("tesT");
  return <span />;
}

function ErrorComp() {
  return <p>Error</p>;
}

export const Layout = MyLayout;
