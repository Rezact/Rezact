import { MyLayout } from "../Layout/nestedLayout";
import { $items, addItem } from "./store";

export default function App() {
  return (
    <>
      <h3>Cart</h3>
      <ul>
        {$items.map(($item, $idx) => (
          <li>
            <Editor $item={$item} $idx={$idx} />
          </li>
        ))}
        <li>
          <button onClick={addItem}>add one</button>
        </li>
      </ul>

      <hr />

      <h3>Details</h3>
      <ul>
        {$items.map(($item) => (
          <li>
            <Viewer $item={$item} />
          </li>
        ))}
      </ul>

      <h3>Total</h3>
      <Result />
    </>
  );
}

function Display({ $value, $hue }) {
  return (
    <div style="display: flex; padding: 4px 0;">
      <span style="width: 200px; word-wrap: break-word">{$value}</span>
      <span style="display: flex; gap: 8px">
        <div style={`width: 64px; background: hsl(${$hue}, 100%, 50%);`} />{" "}
        &lt;- redraw
      </span>
    </div>
  );
}

function Editor({ $item, $idx }) {
  // const item = $item;
  // console.log(item);
  return (
    <div style="display: flex; gap: 8px;">
      <label>
        price:
        <input type="number" value={$item.$price} step="0.5" />
      </label>
      <label>
        quantity:
        <input type="number" value={$item.$qty} />
      </label>
      <button type="button" onClick={() => $items.splice($idx, 1)}>
        remove
      </button>
    </div>
  );
}

function Result() {
  let $trigger = "";
  let $total = $items.reduce((acc, $item) => {
    return acc + $item.$price * $item.$qty;
  }, 0);

  $: {
    $total;
    $trigger = Math.cos(Date.now() / 1000) * 0.5 + 0.5;
  }
  return <Display $value={$total} $hue={`${$trigger * 360}`} />;
}

function Viewer({ $item }) {
  let $trigger = "";
  $: {
    $item.$price;
    $item.$qty;
    $trigger = Math.cos(Date.now() / 1000) * 0.5 + 0.5;
  }
  return (
    <Display
      $value={`${$item.$price.getValue()}, x${$item.$qty.getValue()}`}
      $hue={`${$trigger * 360}`}
    />
  );
}

// export const Layout = MyLayout;