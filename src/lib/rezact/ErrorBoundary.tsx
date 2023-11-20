import {
  // addPostCreateComponentHook,
  // addPreCreateComponentHook,
  errors,
  render,
} from ".";
import { Signal } from "./signals";

// addPreCreateComponentHook((tagName, attributes, hookContext) => {
//   if (tagName !== ErrorBoundary) return;
//   // console.log({ tagName: tagName.name, attributes, hookContext });
// });

// addPostCreateComponentHook((newComp, tagName, attributes, hookContext) => {
//   if (tagName !== ErrorBoundary) return;
//   // console.log({ newComp, tagName, attributes, hookContext });
// });

function DefaultError(props: any) {
  return (
    <div>
      <p>Error</p>
      <textarea>{props.errors.map((err) => err.stack)}</textarea>
    </div>
  );
}

export function ErrorBoundary(props: any) {
  props.fallback = props.fallback || DefaultError;

  const fb =
    typeof props.fallback === "function"
      ? props.fallback
      : () => props.fallback;

  const renderedTree = new Signal(<span />);

  if (errors.length > 0) {
    render(renderedTree, fb, { errors });
    errors.length = 0;
  } else {
    render(renderedTree, () => props.children);
  }

  return renderedTree;
}
