# Understanding the Rezact Compiler Plugin

## Introduction

The Rezact Compiler Plugin is a transformation tool designed to parse and transform source code written using the Rezact library. It is implemented as a Vite plugin and primarily focuses on handling state and reactivity in web development contexts.

## Workflow

1. **Parsing Source Code:**
   The plugin uses the Acorn library to parse the source code into an Abstract Syntax Tree (AST).
2. **Walking the AST:**
   The plugin walks through the AST using `acorn-walk` to identify nodes that require transformation.
3. **Applying Transformations:**
   Based on the identified nodes, the plugin applies transformations using `magic-string` to manipulate the source code strings.

## Example 1 - Signals & Effects

### Source Code

```javascript
let $name = "jesen";
let $width = 10;
let $height = 20;

let $area = $width * $height;

$width = 20;
$height = 40;
```

### Transformed Output

```javascript
import { Signal, effect } from "rezact/signals";

let $name = new Signal("jesen");
let $width = new Signal(10);
let $height = new Signal(20);

let $area = effect(
  ([$width, $height]) => $width.get() * $height.get(),
  [$width, $height]
);

$width.set(20);
$height.set(40);
```

## Example 2 - MapSignals

### Source Code

```javascript
export let $items = [];

export function addItem() {
  $items.push({
    $price: "2",
    $qty: "1",
  });
}
```

### Transformed Output

```javascript
export let $items = new MapSignal([]);

export function addItem() {
  $items.push({
    $price: new Signal("2"),
    $qty: new Signal("1"),
  });
}
```

## Example 3 - Full Component (JSX output retransformed to be readable)

### Source Code

```javascript
export function Page() {
  let $test = ["Jack", "Jill", "John", "Jane"];
  return (
    <>
      <h1>Simple String List</h1>

      {$test.map(($name) => (
        <div dataVal={$name}>
          <input value={$name} />
        </div>
      ))}

      {$test.map(($name) => (
        <div>{$name}</div>
      ))}
    </>
  );
}
```

### Transformed Output

```javascript
import { MapSignal, mapEffect } from "rezact/mapState";
import { useInputs, xCreateElement, xFragment } from "rezact";
useInputs();

export function Page() {
  let $test = new MapSignal(["Jack", "Jill", "John", "Jane"]);
  let $mdup8zy7a7f = mapEffect(([$test]) => $test.Map((item) => item), [$test]);
  let $myvzag0e2rn = mapEffect(([$test]) => $test.Map((item) => item), [$test]);

  return (
    <>
      <h1>Simple String List</h1>

      {mapEffect(
        ([$mdup8zy7a7f]) =>
          $mdup8zy7a7f.Map(($name) => (
            <div dataVal={$name}>
              <input value={$name} />
            </div>
          )),
        [$mdup8zy7a7f]
      )}

      {mapEffect(
        ([$myvzag0e2rn]) => $myvzag0e2rn.Map(($name) => <div>{$name}</div>),
        [$myvzag0e2rn]
      )}
    </>
  );
}
```

### Why Two Separate mapEffects?

In the provided transformed output, there are two `mapEffect` instances over the original `$test` `MapSignal` because there are two separate `.map` calls in the returned JSX. Each `.map` call in the JSX corresponds to a `mapEffect` in the transformed output.

### Source Code

In the JSX, there are two separate `.map` calls on the `$test` variable:

```javascript
{
  $test.map(($name) => (
    <div dataVal={$name}>
      <input value={$name} />
    </div>
  ));
}

{
  $test.map(($name) => <div>{$name}</div>);
}
```

### Transformed Output

Each of these `.map` calls is transformed into a separate `mapEffect` in the transformed output:

```javascript
let $mdup8zy7a7f = mapEffect(([$test]) => $test.Map((item) => item), [$test]);
let $myvzag0e2rn = mapEffect(([$test]) => $test.Map((item) => item), [$test]);
```

Each `mapEffect` is responsible for creating a separate reactive mapping over the `$test` `MapSignal`. The first `mapEffect`, `$mdup8zy7a7f`, corresponds to the first `.map` call in the source code, and the second `mapEffect`, `$myvzag0e2rn`, corresponds to the second `.map` call in the source code.

This separation allows each mapping to be independently reactive to changes in the `$test` `MapSignal`, ensuring that the transformations and renderings inside each `mapEffect` are isolated from each other and only re-compute when necessary, based on changes to their respective dependencies.

In summary, having two separate `mapEffect` instances for two `.map` calls allows for optimized, independent reactivity and rendering for each mapped section of the component.

---

### Enhanced Reactivity in Arrays/Maps

Rezact employs a meticulous and innovative approach to infuse reactivity within each element of an array, even for arrays of primitive types like strings. This approach not only optimizes performance but also significantly elevates the developer experience by automating the process of making each item reactive, freeing developers from the manual burden. Below is a detailed explanation of how Rezact achieves this:

#### 1. **Automated Individual Item Wrapping**

Rezact automatically transforms each item in the array into a reactive entity. Every element in the array is converted into a reactive construct, allowing developers to focus on logic and functionality rather than the intricacies of state management.

#### 2. **Fine-Grained Dependency Tracking**

Rezact tracks the dependencies between each specific item and the computations or effects that rely on it. This ensures that only the components that depend on the changed item are updated, avoiding unnecessary recalculations and re-renders, and optimizing performance.

#### 3. **Accessors and Mutators for Precise Observation**

Rezact employs accessors and mutators (getters and setters) for each reactive item, this allows for the observation and propagation of changes to that item. This enables developers to work with a responsive and intuitive system that accurately reflects state changes in the UI.

#### 4. **Optimized and Selective Reactivity**

By wrapping each item individually, Rezact ensures selective and efficient reactivity, updating only the components affected by a change in a specific item and preventing unnecessary updates and computations for the unaffected parts of the UI.

#### 5. **Simplified Reactive Arrays**

Rezact’s method allows even simple arrays of strings to exhibit advanced reactivity. Developers can work with reactive entities capable of independently triggering UI updates when modified, without having to manually manage the reactivity of each item, simplifying the development process and reducing the likelihood of errors.

---

## Conclusion

The Rezact Compiler Plugin is a meticulous tool designed to transform source code written using the Rezact library. It parses the source code into an AST, walks through the AST to identify nodes requiring transformation, and applies the necessary transformations using `magic-string`. It transforms variables prefixed with `$` to their corresponding implementations in the Rezact library. It analyzes the value being assigned to the `$` prefixed variable to decide what type of implementation should be used and whether or not there are any signals the declared signal depends on.

## Pulling the escape hatch (leak the abstraction)

If you really want to get low level and hands on with the frameworks primitives you can import the functions and classes yourself.

```javascript
import { Signal, effect } from "rezact/signals";
import { MapSignal, mapEffect } from "rezact/mapState";

export function TestManual() {
  let name = new Signal("jesen");
  let width = new Signal(10);
  let height = new Signal(20);

  let area = effect(
    ([width, height]) => width.get() * height.get(),
    [width, height]
  );

  let test = new MapSignal(["Jack", "Jill", "John", "Jane"]);
  let test1 = mapEffect(([test]) => test.Map((item) => item), [test]);
  let test2 = mapEffect(([test]) => test.Map((item) => item), [test]);

  return (
    <div>
      <div>Hallo, {name}</div>
      <div>width: {width}</div>
      <div>height: {height}</div>
      <div>area: {area}</div>
      <button onClick={() => width.set(width.get() + 30)}>Update Width</button>

      <h1>Simple String List</h1>

      {mapEffect(
        ([test1Arr]) =>
          test1Arr.Map((name) => (
            <div dataVal={name}>
              <input value={name} />
            </div>
          )),
        [test1]
      )}
      {mapEffect(
        ([test2Arr]) => test2Arr.Map((name) => <div>{name}</div>),
        [test2]
      )}
    </div>
  );
}
```
