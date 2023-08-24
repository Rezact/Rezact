import { MyLayout } from "../Layout/nestedLayout";
import styleUrl from "./styletest.css?url";

function ShadowDiv(props) {
  const divElm = <div />;

  const shadow = divElm.attachShadow({ mode: "open" });
  props.children.forEach((child) => shadow.appendChild(child));

  return divElm;
}

export function Page() {
  return (
    <>
      <ShadowDiv>
        <link rel="stylesheet" href={styleUrl} />
        <h1>Shadow DOM Test (Scoped CSS)</h1>
        <p>asdfasdf</p>
      </ShadowDiv>
      <h1>asdfasdf</h1>
    </>
  );
}

export const Layout = MyLayout;
