function Select({ children, onChange, setContext }: any) {
  setContext("ctxKey", { update: onChange });

  return (
    <div>
      <p>Select</p>
      {children}
    </div>
  );
}

function Select2({ children, $signal, setContext }: any) {
  setContext("ctxKey", { $signal });

  return (
    <div>
      <p>Select</p>
      {children}
    </div>
  );
}

export { Select, Select2 };
