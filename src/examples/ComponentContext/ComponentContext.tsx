import { MyLayout } from "../Layout/nestedLayout";
import { Option, Option2 } from "./OptionComp";
import { Select, Select2 } from "./SelectComp";

export function Page() {
  let $select1 = "";
  let $select2 = "";
  let $select3 = "";
  let $select4 = "";

  return (
    <>
      <h1>Component Context</h1>
      <p>Select 1 value: {$select1}</p>
      <p>Select 2 value: {$select2}</p>
      <p>Select 3 value: {$select3}</p>
      <p>Select 4 value: {$select4}</p>

      <hr />
      <Select onChange={(selValue) => ($select1 = selValue)}>
        <Option value="Opt 1">Opt 1</Option>
        <Option value="Opt 2">Opt 2</Option>
        <Option value="Opt 3">Opt 3</Option>
      </Select>

      <hr />
      <Select onChange={(selValue) => ($select2 = selValue)}>
        <Option value="Opt 1">Opt 1</Option>
        <Option value="Opt 2">Opt 2</Option>
        <Option value="Opt 3">Opt 3</Option>
      </Select>

      <hr />
      <Select2 $signal={$select3}>
        <Option2 value="Opt 1">Opt 1</Option2>
        <Option2 value="Opt 2">Opt 2</Option2>
        <Option2 value="Opt 3">Opt 3</Option2>
      </Select2>

      <hr />
      <Select2 $signal={$select4}>
        <Option2 value="Opt 1">Opt 1</Option2>
        <Option2 value="Opt 2">Opt 2</Option2>
        <Option2 value="Opt 3">Opt 3</Option2>
      </Select2>
      <hr />
    </>
  );
}

export const Layout = MyLayout;
