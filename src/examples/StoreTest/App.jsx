import { MyLayout } from "../Layout/nestedLayout";
import { StoreButton } from "./StoreButton.jsx";
import { $storeCount } from "./store";

export default function App() {
  return (
    <>
      <StoreButton />
      <p>{$storeCount}</p>
      <button onClick={() => $storeCount++}>Also Inc</button>
    </>
  );
}

export const Layout = MyLayout;
