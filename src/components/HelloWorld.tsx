import { MyLayout } from "src/examples/Layout/layout";
import { xCreateElement, xFragment } from "../lib/rezact/rezact";

let $name = "test";
let $arr: any = [`apple`, "orange", "banana"];

function Button() {
  let $count = 0;

  // let $obj = { $firstName: "", $lastName: "" };
  let xTime = "time";
  let xTimes = "times";
  $: console.log($count, $arr.toJson());
  // $: {
  //   if ($count === 2) console.log("Count is 2");
  //   if ($arr.length === 7) {
  //     $count = 0;
  //     console.log("Arr has 2 members");
  //   }
  // }

  let $testRef = null;

  const handleClick = () => {
    // console.log($testRef);
    $arr.push("asdf");
    $count++;
  };

  let $asdf = $count % 2 === 1 ? true : false;

  return (
    <div>
      <style>
        {`
        .test {
          transition: all 200ms;
        }
        .pink {
          background-color: pink
        }

        .sky {
          background-color: skyblue
        }
      `}
      </style>
      {$arr.map(($item, $idx) => {
        let $testToggle = true;

        return (
          <div>
            <span>
              {$idx}. {$item} {$testToggle ? "On" : "Off"}
            </span>
            <button onClick={() => ($testToggle = !$testToggle)}>Toggle</button>
            <button type="button" onClick={() => $arr.deleteValue($item)}>
              Delete
            </button>
            <br />
          </div>
        );
      })}
      <button
        class={`test ${$count % 2 === 1 ? "pink" : "sky"}`}
        ref={$testRef}
        onClick={handleClick}
      >
        Clicked {$count} {$count === 1 ? xTime : xTimes} {$name}
      </button>
      {$asdf && $count !== -1 && <h1>Show Hide Test {$name}</h1>}
    </div>
  );
}

function Page() {
  let $capName = $name.toUpperCase();
  return (
    <>
      <h1>Hello World {$capName}</h1>
      <label for="test-input">Test Input</label>
      <input id="test-input" value={$name} />
      <button
        onClick={() => {
          $arr.push($name);
          $name = "";
        }}
      >
        asdf
      </button>
      <Button />
      <a href="/post/asdf/something/qwer">Test</a>
    </>
  );
}

export { Page };

export const Layout = MyLayout;
