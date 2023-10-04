export default function Issue22() {
  let $name = "Zafar Ansari";
  let $message = "";
  let $message2 = "";

  $: {
    $message = "My name is " + $name;
    $message2 = $name + " is my name";
  }
  return (
    <>
      <input id="issue-22-input" value={$name} />
      <p id="issue-22-test">{$message}</p>
      <p id="issue-22-test2">{$message2}</p>
    </>
  );
}
