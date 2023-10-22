function Canvas({ ref }) {
  ref.clear = () => console.log("clearing this canvas");

  return <canvas></canvas>;
}

function App() {
  const canvasRef: any = {};

  return (
    <>
      <Canvas ref={canvasRef} />
      <button onClick={() => canvasRef.clear()}>Clear Canvas</button>
    </>
  );
}
