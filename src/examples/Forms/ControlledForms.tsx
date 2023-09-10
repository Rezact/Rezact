import { MyLayout } from "../Layout/nestedLayout";

export function Page() {
  let $firstName = "John";
  let $lastName = "Smith";
  let $age = "30";
  let $child1 = "Bob";
  let $child2 = "Sara";
  let $child3 = "Joe";
  let $scales = true;
  let $horns = false;
  let $drone = "dewey";
  let $selectItem = "Opt 2";

  let $lineItems: any = [
    { $item: "Apple", $price: "1.00", $qty: "4" },
    { $item: "Orange", $price: "2.00", $qty: "5" },
    { $item: "Lemon", $price: "3.00", $qty: "6" },
  ];

  const handleSubmit = (ev) => {
    ev.preventDefault();
  };

  const clearForm = () => {
    $firstName = "";
    $lastName = "";
    $age = "";
    $child1 = "";
    $child2 = "";
    $child3 = "";
    $scales = false;
    $horns = false;
    $drone = "";
    $selectItem = "";

    $lineItems = [];
  };

  const updateForm = () => {
    $firstName = "Jane";
    $lastName = "Doe";
    $age = "40";
    $child1 = "Billy";
    $child2 = "Sally";
    $child3 = "Joey";
    $scales = false;
    $horns = true;
    $drone = "huey";
    $selectItem = "Opt 4";

    $lineItems.push({ $item: "Apple0", $price: "10.00", $qty: "40" });
    $lineItems.push({ $item: "Orange0", $price: "20.00", $qty: "50" });
    $lineItems.push({ $item: "Lemon0", $price: "30.00", $qty: "60" });
  };

  const textAreaRef = <textarea style="width: 100%; height: 300px;"></textarea>;
  const updateTextArea = (_deps = []) => {
    textAreaRef.value = JSON.stringify(
      {
        firstName: $firstName,
        lastName: $lastName,
        age: $age,
        children: [$child1, $child2, $child3],
        checkbox: { scales: $scales, horns: $horns },
        radio: { drone: $drone },
        lineItems: $lineItems.toJson(),
        selectItem: $selectItem,
      },
      null,
      "  "
    );
  };

  $: {
    const deps = [
      $firstName,
      $lastName,
      $age,
      $child1,
      $child2,
      $child3,
      $scales,
      $horns,
      $drone,
      $selectItem,
      $lineItems,
    ];
    updateTextArea(deps);
  }

  const formRef = (
    <form onSubmit={handleSubmit} id="test-form" onChange={updateTextArea}>
      <h1>Controlled Forms and Controls</h1>
      <label for="firstname">First Name</label>
      <input id="firstname" value={$firstName} />
      <label for="lastname">Last Name</label>
      <input id="lastname" value={$lastName} />
      <label for="age">age</label>
      <input id="age" value={$age} />
      <label for="child1">Child 1</label>
      <input id="child1" value={$child1} />
      <label for="child2">Child 2</label>
      <input id="child2" value={$child2} />
      <label for="child3">Child 3</label>
      <input id="child3" value={$child3} />

      <fieldset>
        <legend>Choose your monsters features:</legend>

        <div>
          <input type="checkbox" id="scales" checked={$scales} />
          <label for="scales">Scales</label>
        </div>

        <div>
          <input type="checkbox" id="horns" checked={$horns} />
          <label for="horns">Horns</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Select a maintenance drone:</legend>

        <div>
          <input type="radio" id="huey" value="huey" checked={$drone} />
          <label for="huey">Huey</label>
        </div>

        <div>
          <input type="radio" id="dewey" value="dewey" checked={$drone} />
          <label for="dewey">Dewey</label>
        </div>

        <div>
          <input type="radio" id="louie" value="louie" checked={$drone} />
          <label for="louie">Louie</label>
        </div>
      </fieldset>

      {$lineItems.map(($line) => {
        $: {
          const deps = [$line.$item, $line.$price, $line.$qty];
          updateTextArea(deps);
        }

        return (
          <div>
            <input value={$line.$item} />
            <input value={$line.$price} />
            <input value={$line.$qty} />
          </div>
        );
      })}

      <label for="select-field">Selectable Input</label>
      <select id="select-field" value={$selectItem}>
        <option>Opt 1</option>
        <option>Opt 2</option>
        <option>Opt 3</option>
        <option>Opt 4</option>
      </select>

      <input type="submit" value="Submit" class />
      <input type="button" value="Reset" onClick={clearForm} class />
      <button type="button" onClick={updateForm}>
        Update Form Data
      </button>
    </form>
  );

  updateTextArea();

  return (
    <>
      {formRef}
      <hr />
      <p>Form JSON Data:</p>
      {textAreaRef}
    </>
  );
}

export const Layout = MyLayout;
