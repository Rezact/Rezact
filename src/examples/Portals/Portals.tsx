import { Portal } from "src/lib/rezact/Portal";
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
          <button onClick={() => ($showPortal = false)}>
            Close Portal/Modal
          </button>
        </Portal>
      )}
    </>
  );
}

export const Layout = MyLayout;
