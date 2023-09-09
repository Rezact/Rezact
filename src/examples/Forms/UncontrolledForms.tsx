import { getFormData, setFormData } from "src/lib/rezact/formHelper";
import { MyLayout } from "../Layout/nestedLayout";

const test = {
  name: { first: "dude", last: "hell yes" },
  age: "300",
  children: ["asdf", "qwer", "1234"],
  "select-person": {
    id: 10,
    text: "Emil Schaefer",
    img: "https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    value: "Emil Schaefer",
  },
  checkbox: { scales: false, horns: true },
  radio: { drone: "dewey" },
  lineItems: [
    { item: "Apple0", price: "10.00", qty: "40" },
    { item: "Orange0", price: "20.00", qty: "50" },
    { item: "Lemon0", price: "30.00", qty: "60" },
  ],
  selectItem: "Opt 3",
};

export function Page() {
  const lineItems = [
    { item: "Apple", price: "1.00", qty: "4" },
    { item: "Orange", price: "2.00", qty: "5" },
    { item: "Lemon", price: "3.00", qty: "6" },
  ];

  const handleSubmit = (ev) => {
    ev.preventDefault();
  };

  const clearForm = () => {
    setFormData(formRef, {}, { skipUnsetProperties: false });
  };

  const updateForm = () => {
    setFormData(formRef, test);
  };

  const textAreaRef = <textarea style="width: 100%; height: 300px;"></textarea>;
  const updateTextArea = () => {
    const data = getFormData(formRef);
    textAreaRef.value = JSON.stringify(data, null, "  ");
  };

  const formRef = (
    <form onSubmit={handleSubmit} id="test-form" onChange={updateTextArea}>
      <h1>Uncontrolled Forms and Controls</h1>
      <label for="firstname">First Name</label>
      <input id="firstname" name="name.first" value="John" />
      <label for="lastname">Last Name</label>
      <input id="lastname" name="name.last" value="Smith" />
      <label for="age">age</label>
      <input id="age" name="age" value="30" />
      <label for="child1">Child 1</label>
      <input id="child1" name="children[0]" value="Bob" />
      <label for="child2">Child 2</label>
      <input id="child2" name="children[1]" value="Sara" />
      <label for="child3">Child 3</label>
      <input id="child3" name="children[2]" value="Joe" />

      <fieldset>
        <legend>Choose your monsters features:</legend>

        <div>
          <input type="checkbox" id="scales" name="checkbox.scales" checked />
          <label for="scales">Scales</label>
        </div>

        <div>
          <input type="checkbox" id="horns" name="checkbox.horns" />
          <label for="horns">Horns</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Select a maintenance drone:</legend>

        <div>
          <input
            type="radio"
            id="huey"
            name="radio.drone"
            value="huey"
            checked
          />
          <label for="huey">Huey</label>
        </div>

        <div>
          <input type="radio" id="dewey" name="radio.drone" value="dewey" />
          <label for="dewey">Dewey</label>
        </div>

        <div>
          <input type="radio" id="louie" name="radio.drone" value="louie" />
          <label for="louie">Louie</label>
        </div>
      </fieldset>

      {lineItems.map((line, idx) => (
        <div>
          <input name={`lineItems[${idx}].item`} value={line.item} />
          <input name={`lineItems[${idx}].price`} value={line.price} />
          <input name={`lineItems[${idx}].qty`} value={line.qty} />
        </div>
      ))}

      <label for="select-field">Selectable Input</label>
      <select id="select-field" name="selectItem" value="Opt 2">
        <option>Opt 1</option>
        <option>Opt 2</option>
        <option>Opt 3</option>
        <option>Opt 4</option>
      </select>

      <input
        type="submit"
        value="Submit"
        className="rounded-lg bg-themeShade-300 p-2 hover:bg-slate-500 dark:bg-dThemeShade-300"
      />
      <input
        type="button"
        value="Reset"
        onClick={clearForm}
        className="rounded-lg bg-themeShade-300 p-2 hover:bg-slate-500 dark:bg-dThemeShade-300"
      />
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
