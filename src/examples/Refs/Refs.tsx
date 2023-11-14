import { MyLayout } from "../Layout/nestedLayout";

function Canvas({ ref: incomingRef }) {
  incomingRef.clear = () => console.log("clearing this canvas");
  const ref = {};

  return (
    <canvas
      ref={ref}
      onClick={() => console.log("testing ref attribute", ref)}
    ></canvas>
  );
}

export function Page() {
  const canvasRef: any = {};

  return (
    <>
      <Canvas ref={canvasRef} />
      <button onClick={() => canvasRef.clear()}>Clear Canvas</button>
    </>
  );
}

export const Layout = MyLayout;
