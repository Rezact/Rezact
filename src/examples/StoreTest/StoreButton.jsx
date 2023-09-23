import { store } from "./store";

export function StoreButton() {
  return <button onClick={() => store.$storeCount++}>Inc Here</button>;
}
