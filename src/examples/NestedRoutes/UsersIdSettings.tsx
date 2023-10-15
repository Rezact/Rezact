import { MyLayout } from "../Layout/nestedLayout";

export default function ({ routeParams, router_outlet }) {
  // console.log("asdf", router_outlet);
  return (
    <div>
      <h1>3. Users ID Settings START</h1>
      <p>ID: {routeParams.id}</p>
      {router_outlet}
      <p>3. Users ID Settings END</p>
    </div>
  );
}

export const Layout = MyLayout;
