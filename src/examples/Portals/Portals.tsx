import { createPortal } from "src/lib/rezact/portal";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  const TestPortal = createPortal("#portal-out");

  return (
    <>
      <h1>Portals</h1>
      <TestPortal>
        <p>child1</p>
        <>
          <p>child2</p>
        </>
        <p>child3</p>
      </TestPortal>
    </>
  );
}

export const Layout = MyLayout;
