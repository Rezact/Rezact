import { xCreateElement, xFragment } from "src/lib/rezact/rezact";

export function MyLayout({ Component, pageProps }: any) {
  return (
    <>
      <h1>Layout</h1>
      <Component {...pageProps} />
    </>
  );
}
