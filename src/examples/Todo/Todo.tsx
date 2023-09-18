let $todos: any = [
  { $text: "Learn Rezact", $completed: false },
  { $text: "Learn TypeScript", $completed: true },
  { $text: "Build something awesome", $completed: false },
];

export function Page() {
  let $filter = "all";
  let $filteredTodos = $todos.filter((todo) => {
    if ($filter === "all") return true;
    if ($filter === "completed") return todo.$completed;
    if ($filter === "todo") return !todo.$completed;
  });

  let $newTodoText = "";

  const addTodo = (ev) => {
    ev.preventDefault();
    if ($newTodoText.trim() === "") return;

    $todos.push({ $text: $newTodoText, $completed: false });
    $newTodoText = "";
  };

  const clearCompleted = () => {
    const completed = $todos.filter((todo) => todo.$completed);
    completed.forEach((todo) => $todos.deleteValue(todo));
  };

  const checkAll = () => {
    const areAllMarked = $todos.every((todo) => todo.$completed);
    $todos.forEach((todo) => (todo.$completed = !areAllMarked));
    $todos.refresh();
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
        <TodoItem todo={$todo} idx={$idx} />
      ))}

      <form onSubmit={addTodo}>
        <input placeholder="Add Todo" value={$newTodoText} />
        <button onClick={addTodo}>Add</button>
      </form>

      <button onClick={clearCompleted}>Remove Completed</button>
      <button onClick={checkAll}>Check All</button>
    </>
  );
}

let currentEditingTodo = null;
function editModeClickListener(ev) {
  if (ev.target === currentEditingTodo.editInput) return;
  currentEditingTodo.editing.setValue(false);
  document.removeEventListener("click", editModeClickListener);
}

function TodoItem(props) {
  const $todo = props.todo;
  const $idx = props.idx;
  let $editing = false;

  const deleteTodo = (todo) => {
    $todos.deleteValue(todo.value);
  };

  const closeOnEnter = (ev) => {
    if (ev.key !== "Enter") return;
    $editing = false;
    document.removeEventListener("click", editModeClickListener);
  };

  const editInput = <input onKeyDown={closeOnEnter} value={$todo.$text} />;

  const setEditing = () => {
    $editing = !$editing;
    const editing = $editing;
    currentEditingTodo = { editInput, editing };
    document.addEventListener("click", editModeClickListener);
    editInput.setSelectionRange(0, editInput.value.length);
    editInput.focus();
  };

  return (
    <div style={`${$todo.$completed ? "text-decoration: line-through;" : ""}`}>
      {$editing && editInput}
      {!$editing && (
        <span onDblClick={setEditing}>
          {$idx + 1} - {$todo.$text}
        </span>
      )}
      <input
        type="checkbox"
        checked={$todo.$completed}
        onClick={$todos.refresh}
      />
      <button onClick={() => deleteTodo($todo)}>X</button>
    </div>
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
