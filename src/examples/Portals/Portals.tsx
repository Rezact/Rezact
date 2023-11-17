import { Portal } from "src/lib/rezact/portal";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  let $showPortal = false;

  return (
    <>
      <h1>Portals</h1>

      <button onClick={() => ($showPortal = !$showPortal)}>
        Toggle Portal
      </button>

      {$showPortal && (
        <Portal>
          <p>child1</p>
          <>
            <p>child2</p>
          </>
          <p>child3</p>
        </Portal>
      )}
    </>
  );
}

export const Layout = MyLayout;
