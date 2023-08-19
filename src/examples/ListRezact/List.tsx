// import { xCreateElement, xFragment } from "rezact";
import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  const _things: any = [
    { id: 1, color: "darkblue" },
    { id: 2, color: "indigo" },
    { id: 3, color: "deeppink" },
    { id: 4, color: "salmon" },
    { id: 5, color: "gold" },
  ];

  let $things: any = [..._things];
  let $things2: any = [..._things];

  function handleClick() {
    $things.splice(0, 1);
    $things2.splice(0, 1);
  }

  // function handleSwap() {
  //   const len = $things.length;
  //   // if (len > 1)
  //   //   $things = [$things[len - 1], ...$things.slice(1, len - 1), $things[0]];
  //   const memo = $things[len - 1];
  //   $things[len - 1] = $things[0];
  //   $things[0] = memo;
  // }

  return (
    <>
      <button onClick={handleClick}> Remove first thing </button>
      {/* <button onClick={handleSwap}> Swap first thing and last thing </button> */}

      <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 1em">
        <div>
          <h2>Keyed</h2>
          {$things.map(($thing) => (
            <Thing current={$thing.color} />
          ))}
        </div>

        <div>
          <h2>Unkeyed</h2>
          {$things2.map(($thing) => (
            <Thing current={$thing.color} />
          ))}
        </div>
      </div>
    </>
  );
}

function Thing({ current }) {
  // ...but `initial` is fixed upon initialisation
  const initial = current;

  return (
    <>
      <p>
        <span style={`background-color: ${initial}`}>initial</span>
        <span style={`background-color: ${current}`}>current</span>
      </p>

      <style>
        {`span {
          display: inline-block;
          padding: 0.2em 0.5em;
          margin: 0 0.2em 0.2em 0;
          width: 4em;
          text-align: center;
          border-radius: 0.2em;
          color: white;
        }`}
      </style>
    </>
  );
}

export const Layout = MyLayout;
