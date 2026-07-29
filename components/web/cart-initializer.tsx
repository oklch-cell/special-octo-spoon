import { CheckOut } from "./checkout";
import { CartItems } from "./cart-items";

export function CartInitializer() {
  return (
    <main className="p-5 flex flex-col md:flex-row gap-5 max-w-200 w-full mx-auto">
      <CartItems />
      <CheckOut />
    </main>
  );
}
