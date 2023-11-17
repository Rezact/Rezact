import {
  // addPostCreateComponentHook,
  // addPreCreateComponentHook,
  render,
} from ".";

// addPreCreateComponentHook((tagName, attributes, hookContext) => {
//   console.log({ tagName, attributes, hookContext });
// });
// addPostCreateComponentHook((newComp, tagName, attributes, hookContext) => {
//   console.log({ newComp, tagName, attributes, hookContext });
// });

export function Portal(props: any) {
  const { children } = props;
  let { target } = props;
  const tempDiv = document.createElement("div");
  let elmRefs = [];

  const portalMount = () => {
    if (!target) target = document.body;
    if (typeof target === "string") target = document.querySelector(target);

    render(tempDiv, () => children);
    while (tempDiv.firstChild) {
      elmRefs.push(tempDiv.firstChild);
      target.appendChild(tempDiv.firstChild);
    }
  };

  const portalUnmount = () => {
    const elmLen = elmRefs.length;
    for (let i = 0; i < elmLen; i++) {
      const elm = elmRefs.pop();
      elm.remove();
    }
  };

  const portalIn = (
    <span data-portal="in" onMount={portalMount} onUnmount={portalUnmount} />
  );
  return portalIn;
}
