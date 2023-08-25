// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

function get(url) {
  let $isLoading = true;
  let $error = null;
  let $data = [];

  (async () => {
    const resp = await fetch(url);
    const data = await resp.json();
    setTimeout(() => {
      $isLoading = false;
      $data = data;
    }, 1000);
  })();
  return [$isLoading, $error, $data];
}

export function Page() {
  const [$isLoading, $error, $data] = get("/test.json");

  return (
    <>
      <h1>Data Fetching</h1>

      {$isLoading && <p>Loading</p>}
      {$error && <p>Error</p>}

      {$data.map(($item) => (
        <p>{$item.testData}</p>
      ))}
    </>
  );
}

export const Layout = MyLayout;
