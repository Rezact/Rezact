import { describe, expect, it } from "vitest";
import { render } from "rezact";

let canvasClicked = false;
let clearedCanvasClicked = false;
const ref: any = {};

function Canvas({ ref: incomingRef }) {
  incomingRef.clear = () => (clearedCanvasClicked = true);

  return <canvas ref={ref} onClick={() => (canvasClicked = true)}></canvas>;
}

function Page() {
  const canvasRef: any = {};

  return (
    <>
      <Canvas ref={canvasRef} />
      <button onClick={() => canvasRef.clear()}>Clear Canvas</button>
    </>
  );
}

describe("Refs Test Suite", () => {
  it("Test Refs", async () => {
    render(document.body, Page);
    const button = document.querySelector("button");
    const canvas = document.querySelector("canvas");
    button.click();
    canvas.click();
    expect(ref.elm).toBe(canvas);
    expect(canvasClicked).toBe(true);
    expect(clearedCanvasClicked).toBe(true);
  });
});
