function Option({ children, value, getContext }: any) {
  //
  // this won't work as context is not ready yet
  //const context = getContext("ctxKey"); //throws ReferenceError: Cannot access 'contextRoot' before initialization

  // once the app/component is rendered, context is ready
  const handleClick = () => getContext("ctxKey").update(value);

  return (
    <div class="option" onClick={handleClick} value={value}>
      {children}
    </div>
  );
}

function Option2({ children, value, getContext }: any) {
  const handleClick = () => (getContext("ctxKey").$signal = value);

  return (
    <div class="option" onClick={handleClick} value={value}>
      {children}
    </div>
  );
}

export { Option, Option2 };
