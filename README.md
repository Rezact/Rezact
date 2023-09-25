# Rezact

## Intuitive Reactivity, Simplified State.

Embrace a modern UI framework that encourages direct data mutations, offers module-level reactivity, and simplifies component design. With Rezact, you get the power of reactivity without the boilerplate. Dive into a seamless development experience tailored for today's web.

```jsx
export default function App() {
  let $counter = 0;

  return (
    <>
      <h1>Hello World</h1>
      <p>{$counter}</p>

      <button onClick={() => $counter--}>Dec</button>
      <button onClick={() => $counter++}>Inc</button>
    </>
  );
}
```

---

# Table of Contents

- [Intro](#reactivity-without-the-hooks-powered-by-jsx-and-function-components)
  - [Key Features](#key-features)
  - [Why Choose Rezact](#why-choose-rezact)
- [Getting Started](#getting-start-with-rezact)
- [Understanding Rezact's Reactivity System](#understanding-rezacts-reactivity-system)
  - [1. Reactive Variables](#1-reactive-variables)
  - [2. Direct Data Mutation](#2-direct-data-mutation)
  - [3. Module Level Reactivity](#3-module-level-reactivity)
  - [4. Automatic List Handling](#4-automatic-list-handling-in-rezact)
  - [5. Two-Way Data Binding](#5-two-way-data-binding)
  - [6. Reactive Computations](#6-reactive-computations)
  - [7. Reactive Statements](#7-reactive-statements-like-svelte)
- [Rezact "Stores": Simplified State Management](#rezact-stores-simplified-state-management)
  - [Creating a Store](#creating-a-store)
  - [Using the Store](#using-the-store)
  - [Modifying the Store](#modifying-the-store)
  - [Benefits of Rezact Stores](#benefits-of-rezact-stores)
- [Uncontrolled Components](#rezacts-uncontrolled-components)
  - [What are Uncontrolled Components?](#what-are-uncontrolled-components)
  - [Rezact's Approach to Uncontrolled Components](#rezacts-approach-to-uncontrolled-components)
- [More Examples](#more-examples)
- [FAQ](#faq)
  - [Why the name Rezact?](#why-the-name-rezact)
  - [Does it work with Tailwind?](#does-it-work-with-tailwind)
- [Contributing](#getting-started-with-contributing-to-this-package)

---

## Reactivity Without the Hooks, Powered by JSX and Function Components

Rezact redefines web development by offering unparalleled reactivity without the intricacies of hooks, all while harnessing the expressive power of JSX and function components. Designed for the modern web, Rezact bridges the gap between simplicity and power, allowing developers to craft dynamic user interfaces with ease and precision.

### Key Features:

- **Familiar JSX Syntax:** Start coding with the widely-adopted JSX syntax. If you're acquainted with React or similar frameworks, Rezact's syntax will feel like second nature, ensuring rapid onboarding and development.
- **Reactivity Without the Hooks:** Experience the magic of reactivity without wrestling with hooks. With Rezact, state management is intuitive and direct, eliminating the learning curve often associated with hook-based systems.
- **Reactive Variables:** With a simple $ prefix, declare variables that automatically synchronize with the UI. This direct approach to reactivity streamlines development and reduces boilerplate.
- **Direct Data Mutation:** Modify data directly and let Rezact handle the rest. This approach ensures optimal performance and reactivity, making state updates feel natural and efficient.
- **Module-Level State:** Declare state variables outside components for global accessibility. This modular approach to state ensures a clean and organized codebase.
- **Automatic List Handling:** Render lists without the hassle of manual key management. Rezact's smart list handling ensures efficient updates and rendering, every time.
- **Reactive Statements:** Link logic to data changes effortlessly. From logging to side effects, Rezact's reactive statements offer a clear and concise way to respond to data mutations.
- **Simplified Stores:** Manage your app's state with ease using Rezact's straightforward store system. Export an object with reactive properties, and you've got a centralized store ready to go.

### Why Choose Rezact?

Rezact is more than just a frontend framework—it's a paradigm shift in web development. By combining the familiarity of JSX with a hook-free reactivity model, Rezact empowers developers to focus on creativity and innovation. Whether you're building a small web app or a complex platform, Rezact provides the tools and simplicity to turn your ideas into reality.

---

## Getting Start with Rezact

Quick Start Single Bare Minimum:

```bash
npm create @rezact/app@latest my-rezact-project
cd my-rezact-project
npm install
npm run dev
```

---

# Understanding Rezact's Reactivity System

Rezact offers a unique approach to reactivity, simplifying state management and component updates. This section will delve into the core principles of Rezact's reactivity system.

## 1. Reactive Variables

In Rezact, reactive variables are prefixed with a `$` sign. These variables are special because any changes to them will automatically trigger updates in the UI.

```jsx
let $count = 0;

let $todos = [
  { $text: "Learn Rezact", $completed: false },
  { $text: "Build an app", $completed: true },
];
```

Unlike traditional state management systems where state changes are explicitly triggered, in Rezact, simply modifying the value of a reactive variable is enough. Also notice that a reactive variable can be an array of objects with reactive properties as shown above.

## 2. Direct Data Mutation

One of the standout features of Rezact is its encouragement of direct data mutations. While many modern frameworks advocate for immutability, Rezact takes a different approach.

```jsx
// These will trigger a UI update

$count++;

$todos.push({ $text: "This is awesome!", $completed: false });
```

## 3. Module-Level Reactivity

Rezact allows you to declare reactive variables outside of components, making them module-level. This means you can share state across multiple components without resorting to props drilling or context providers.

```jsx
let $moduleLevelState = "I Love Rezact Modules";
const updateModState = () => ($moduleLevelState = "Some New Module Value");

function SomeComponent() {
  let $componentLevelState = "I Love Rezact Components";
  const updateState = () => ($componentLevelState = "Some New Component Value");

  return (
    <>
      <p>{$moduleLevelState}</p>
      <p>{$componentLevelState}</p>
      <button onClick={updateModState}>Change Module Level State</button>
      <button onClick={updateState}>Change Component Level State</button>
    </>
  );
}
```

This feature simplifies state management, especially for global states like themes, user data, or configurations (see [Rezact Stores](#rezact-stores-simplified-state-management)).

## 4. Automatic List Handling in Rezact

Rezact manages lists behind the scenes without requiring explicit keys via a key prop. When you map over an array to render a list of components, Rezact automatically keeps track of each item's identity, ensuring efficient updates.

```jsx
{
  $filteredTodos.map(($todo, $idx) => <TodoItem todo={$todo} idx={$idx} />);
}
```

## 5. Two-Way Data Binding

Rezact supports two-way data binding out of the box. When you bind a reactive variable to an input element, changes in the input will automatically update the variable, and vice versa.

```jsx
let $inputValue = "";
...
<input value={$inputValue} />
```

This two-way binding reduces the need for explicit event handlers to sync input values with state variables. But don't worry, if you still prefer to manage the state updates yourself you can: simply add the `onChange` or `onInput` prop as you would normally and the two-way data binding is cancelled.

However, it should be noted that Rezact actually encourages the use of "Uncontrolled Inputs" as these are most performant and we provide some tools to make them even better. (See Rezact Uncontrolled Inputs)

## 6. Reactive Computations

Rezact allows you to derive values from reactive variables. These derived values are themselves reactive and will update whenever their dependencies change.

```jsx
let $filteredTodos = $todos.filter(todo => ...);
```

In the example above, $filteredTodos will automatically update whenever $todos changes.

## 7. Reactive Statements (like Svelte!)

Rezact uses a concise and intuitive way to respond to changes in reactive data: reactive statements. These statements automatically execute whenever the data they depend on changes.

A reactive statement starts with the $: label, followed by the statement you want to execute:

```jsx
$: console.log(`the count is ${count}`);

$: {
  console.log(`the count is ${count}`);
  console.log(`this will also be logged whenever count changes`);
}
```

## Conclusion

Rezact's reactivity system is designed to simplify state management and UI updates. By embracing direct data mutations, module-level state variables, and intuitive two-way data binding, Rezact offers a refreshing take on modern UI development. As you work with Rezact, you'll discover the power and flexibility of its reactivity system, making web development more efficient and enjoyable.

---

# Rezact Stores: Simplified State Management

In Rezact, state management is made even more straightforward. Unlike other frameworks where stores might involve a lot of boilerplate or additional libraries, Rezact offers a minimalist and intuitive approach.

## Creating a Store

To create a store in Rezact, all you need to do is export an object with reactive properties:

```jsx
export const userData = {
  $userName: "Jeff",
  $isLoggedIn: true,
};
```

The $ prefix indicates that these properties are reactive. Any changes to these properties will automatically reflect wherever they're used.

## Using the Store

To use the store in your components, simply import it:

```jsx
import { userData } from "./path-to-store";

function UserProfile() {
  return (
    <div>
      <p>Username: {userData.$userName}</p>
      <p>Status: {userData.$isLoggedIn ? "Logged In" : "Logged Out"}</p>
    </div>
  );
}
```

## Modifying the Store

Since Rezact encourages direct data mutations, updating the store is as easy as modifying an object property:

```jsx
function login() {
  userData.$isLoggedIn = true;
}

function changeUsername(newName) {
  userData.$userName = newName;
}
```

These changes will automatically update any components that use the userData store, thanks to Rezact's reactivity system.

## Benefits of Rezact Stores

- Simplicity: No need for actions, reducers, or dispatchers. Just plain objects with reactive properties.
- Modularity: By organizing related data into different stores, you can structure your app's state in a modular and maintainable manner.
- Reusability: Stores can be imported and used across multiple components, ensuring a single source of truth for your data.
- Efficiency: With direct data mutations and automatic UI updates, Rezact stores eliminate the need for unnecessary re-renders or complex state synchronization logic.

Conclusion

Rezact stores offer a refreshing take on state management, emphasizing simplicity and efficiency. By leveraging the power of reactive properties and direct data mutations, Rezact ensures that managing and updating your app's state is a seamless experience.

---

# Rezact's Uncontrolled Components

## Introduction

In the world of frontend frameworks, the debate between controlled and uncontrolled components has always been a hot topic of discussion. Rezact offers a refreshing perspective by encouraging the use of uncontrolled components.

## What are Uncontrolled Components?

Uncontrolled components are form elements that maintain their own internal state. Instead of relying on the framework to manage the state of each form element, uncontrolled components allow the DOM to handle it. This means you can directly interact with these elements without going through a state management system.

## Why Use Uncontrolled Components?

- **Simplicity:** Eliminate the need for state management boilerplate for each form element.
- **Performance:** Uncontrolled components can be faster by completely bypassing the framework's re-rendering mechanism.
- **Flexibility:** Easily integrate with third-party libraries that expect direct DOM access.

## Rezact's Approach to Uncontrolled Components

Rezact provides utility functions to seamlessly work with uncontrolled components, making it easy to retrieve or update form data.
Key Utility Functions:

- **getFormData(formRef):** Fetches the form data as a JSON object.
- **setFormData(formRef, data):** Updates the form with the provided data.

## How to Use Uncontrolled Components in Rezact

Declare Your Form Elements: Create your form with various input types. Remember, you don't need to bind them to a state variable.

```jsx
<input id="firstname" name="name.first" value="John" />
```

Handle Form Submission: Use Rezact's utility functions to interact with the form data.

```jsx
const handleSubmit = (ev) => {
  ev.preventDefault();
  const data = getFormData(formRef);
  // data contains a structure that resembles the dot notated name field
  // data = {
  //   name: {
  //     first: "John"
  //   }
  // }
  doStuffWithTheFormData(data);
};

const formRef = <form onSubmit={handleSubmit}>...</form>;
```

Manipulate Form Data: Use the setFormData function to update the form with new data:

```jsx
const fetchData = async () => {
  const resp = await fetch("/data");
  const newData = await resp.json();
  // newData should contain a structure that is the
  // same as what would be returned by getFormData
  // data = {
  //   name: {
  //     first: "John"
  //   }
  // }
  setFormData(formRef, newData);
};
```

## Conclusion:

Rezact's encouragement of uncontrolled components offers a refreshing take on form handling. By reducing the boilerplate and complexity associated with controlled components, developers can focus on building features and logic. The utility functions provided by Rezact further simplify interactions with uncontrolled forms, making it a powerful tool for modern web development.

---

## More Examples

There are lots of examples in the `src/examples` folder in this repo: https://github.com/Rezact/Rezact/tree/main/src/examples

---

# FAQ

## Why the name Rezact?

The name "Rezact" is a fusion of the words "React" and "Exact." While "React" nods to the foundational concepts familiar to many frontend developers, "Exact" underscores our framework's commitment to precision, clarity, and a streamlined approach. Rezact aims to offer developers an experience that is both familiar and refined.

## Does it work with Tailwind?

Yes!!

Full tailwind support, no fancy setup, works as expected using the standard install guide for Vite:

https://tailwindcss.com/docs/guides/vite

Only thing to do additionally is add `import './index.css'` to the top of your app or layout.

---

# Getting Started with Contributing to this package

Want to contribute!!! Awesome! Still working on full contributing guide, but
for now feel free to dive right in and open PR's.

Want to chat? Reach out to me on twitter: https://twitter.com/zachwritescode

Clone the repo and install dependencies, spin up a dev server.

```bash
# install dependencies
npm install

# run the dev server to show examples at http://localhost:5173/
npm run dev

# run the test suite
npm run test

# run the test suite with coverage report saved in ./coverage
npm run coverage

```

---
