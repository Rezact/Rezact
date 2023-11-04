import { MyLayout } from "../Layout/nestedLayout";

export function Page({ router }) {
  router.onBeforeLeave(() => {
    if ($chkVal === false) return false;
  });

  let $chkVal = false;
  return (
    <>
      <h1>On Before Leave</h1>
      <div>
        <input id="allow-leaving" type="checkbox" value={$chkVal} />
        <label for="allow-leaving">Allow Leaving This Route</label>
      </div>
    </>
  );
}

export const Layout = MyLayout;
