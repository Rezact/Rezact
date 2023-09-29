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
      <div id="iss14-1">Hallo, {name}</div>
      <div id="iss14-2">width: {width}</div>
      <div id="iss14-3">height: {height}</div>
      <div id="iss14-4">area: {area}</div>
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
