import { MyLayout } from "../Layout/nestedLayout";
import { StoreButton } from "./StoreButton";
import { store } from "./store";

export default function App() {
  return (
    <>
      <StoreButton />
      <p>{store.$storeCount}</p>
      <button onClick={() => store.$storeCount++}>Also Inc</button>
      <hr />
      <TestNested />
    </>
  );
}

function TestNested() {
  function updateStore1() {
    store.$count++;
  }
  function updateStore2() {
    store.$count += 1;
  }
  function updateStore3() {
    store.$count--;
  }
  function updateStore4() {
    store.$count -= 1;
  }
  function updateStore5() {
    store.$count *= 2;
  }
  function updateStore6() {
    store.$count /= 2;
  }
  function updateStore7() {
    store.$count = store.$count + 2;
  }
  function updateStore8() {
    store.$count = store.$count - 2;
  }
  function updateStore9() {
    store.$count = store.$count * 3;
  }
  function updateStore10() {
    store.$count = store.$count / 3;
  }
  return (
    <>
      <button onClick={updateStore1}>Inc 1</button>
      <button onClick={updateStore2}>Inc 1</button>
      <button onClick={updateStore3}>Dec 1</button>
      <button onClick={updateStore4}>Dec 1</button>
      <button onClick={updateStore5}>Mul 2</button>
      <button onClick={updateStore6}>Div 2</button>
      <button onClick={updateStore7}>Inc 2</button>
      <button onClick={updateStore8}>Dec 2</button>
      <button onClick={updateStore9}>Mul 3</button>
      <button onClick={updateStore10}>Div 3</button>
      <br />
      <strong>{store.$count}</strong>
    </>
  );
}

export const Layout = MyLayout;
