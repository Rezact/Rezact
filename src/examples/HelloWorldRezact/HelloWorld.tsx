import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  return (
    <>
      <h1>Hello World</h1>
      <svg
        class="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </>
  );
}

export const Layout = MyLayout;
