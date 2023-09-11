export function Page() {
  let $todos: any = [
    { $text: "Learn Rezact", $completed: false },
    { $text: "Learn TypeScript", $completed: true },
    { $text: "Build something awesome", $completed: false },
  ];

  let $filter = "all";
  let $filteredTodos = $todos.filter((todo) => {
    if ($filter === "all") return true;
    if ($filter === "completed") return todo.$completed;
    if ($filter === "todo") return !todo.$completed;
  });

  let $newTodoTitle = "";

  const addTodo = (ev) => {
    ev.preventDefault();
    if ($newTodoTitle.trim() === "") return;

    $todos.push({ $text: $newTodoTitle, $completed: false });
    $newTodoTitle = "";
  };

  const deleteTodo = (todo) => {
    $todos.deleteValue(todo.value);
  };

  const clearCompleted = () => {
    const completed = $todos.filter((todo) => todo.$completed);
    completed.forEach((todo) => $todos.deleteValue(todo));
  };

  return (
    <>
      <h1>Todo List</h1>
      <p>{$todos.length} Todos</p>

      <fieldset>
        <legend>Filter:</legend>
        <Radio label="Show All" id="all" checked={$filter} />
        <Radio label="Show Completed" id="completed" checked={$filter} />
        <Radio label="Show Todo" id="todo" checked={$filter} />
      </fieldset>

      {$filteredTodos.map(($todo, $idx) => (
        <div
          style={`${$todo.$completed ? "text-decoration: line-through;" : ""}`}
        >
          {$idx + 1} - {$todo.$text}
          <input type="checkbox" checked={$todo.$completed} />
          <button onClick={() => deleteTodo($todo)}>X</button>
        </div>
      ))}

      <form onSubmit={addTodo}>
        <input value={$newTodoTitle} />
        <button onClick={addTodo}>Add</button>
      </form>

      <button onClick={clearCompleted}>Remove Completed</button>
    </>
  );
}

function Radio({ label, id, checked }) {
  return (
    <div>
      <input type="radio" id={id} value={id} checked={checked} />
      <label for={id}>{label}</label>
    </div>
  );
}
