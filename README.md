# Rezact

A JavaScript UI Framework/Library (call it what you want) that blends the best of svelte, solid, react, and many others.

When you need you app to react exact, reach for Rezact.

## Features

- Blazingly Fast
- Lightweight
- Tree Shakable
- NO VDOM
- Fine Grained DOM Updates
- Functional JSX Components
- Svelte like state management enabled by the compiler
- SolidJS like signal fine grained reactivity

---

## More Detail

Rezact is designed to react exactly as you want to your state changes with fine grained DOM updates and no virtual DOM or diffing.

Rezact is designed with the intention of combining the best of your favorite frameworks, with a particular focus on functional JSX components with a svelte style of state management: no useState hooks, simply declare variables and the compiler handles transforming them into reactive signals.

Rezact combines a minimal framework with a compiler to bring the best of both. The framework is very compatible with tree shaking and vite is great at bundling only the code that you use from the framework. This can make simple stateless components/applications bundles almost as small as writing pure HTML. The compiler reduces the amount of boilerplate you need to type in your functional components by transforming them like svelte does.

---

## Getting Start with Rezact

Quick Start Single Component Example Template:

```bash
npx degit https://github.com/Rezact/rezact-quick-start my-rezact-project
cd my-rezact-project
npm install
npm run dev
```

---

## Getting Started with Contributing to this package

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
