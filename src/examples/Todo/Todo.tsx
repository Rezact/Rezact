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

        <div>
          <input type="radio" id="all" value="all" checked={$filter} />
          <label for="all">Show All</label>
        </div>

        <div>
          <input type="radio" id="comp" value="completed" checked={$filter} />
          <label for="comp">Show Completed</label>
        </div>

        <div>
          <input type="radio" id="todo" value="todo" checked={$filter} />
          <label for="todo">Show Todo</label>
        </div>
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
