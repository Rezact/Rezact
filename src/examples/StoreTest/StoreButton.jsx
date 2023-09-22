import { $storeCount } from "./store";

export function StoreButton() {
  return <button onClick={() => $storeCount++}>Inc Here</button>;
}
