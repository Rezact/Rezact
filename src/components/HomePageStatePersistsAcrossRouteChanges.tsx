import { MyLayout } from "src/examples/Layout/nestedLayout";
// import { xCreateElement, xFragment } from "rezact";

let $name = "test";
// let $arr: any = [`apple`, "orange", "banana"];
let $arr: any = [
  { name: "apple", $toggle: true },
  { name: "orange", $toggle: true },
  { name: "banana", $toggle: true },
];

let $count = 0;
function Button() {
  // let $obj = { $firstName: "", $lastName: "" };
  let xTime = "time";
  let xTimes = "times";
  // $: console.log($count, $arr.toJson());
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
    $arr.push({ name: "asdf", $toggle: true });
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
        return (
          <div>
            <span>
              {$idx}. {$item.name} {$item.$toggle ? "On" : "Off"}
            </span>
            <button onClick={() => ($item.$toggle = !$item.$toggle)}>
              Toggle
            </button>
            <button type="button" onClick={() => $arr.splice($idx, 1)}>
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
          $arr.push({ name: $name, $toggle: true });
          $name = "";
        }}
      >
        asdf
      </button>
      <Button />
      <a style="display: block;" href="/post/asdf/something/qwer">
        Test No Target (Only loads new page)
      </a>
      <a
        style="display: block;"
        href="/post/asdf/something/qwer"
        target="_self"
      >
        Test Target _self (reloads page)
      </a>
      <a style="display: block;" href="https://google.com" target="_blank">
        Google Target _blank
      </a>
    </>
  );
}

export { Page };

export const Layout = MyLayout;
