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

export function createPortal(elm) {
  return function Portal(props: any) {
    const { children } = props;
    const portalMount = () => {
      if (typeof elm === "string") elm = document.querySelector(elm);
      elm.dataset.portal = "out";
      elm.innerHTML = "";

      render(elm, () => children);
      portalIn.rzPortalOut = elm;
      elm.rzPortalIn = portalIn;
    };

    const portalIn = <span data-portal="in" onMount={portalMount} />;
    return portalIn;
  };
}
