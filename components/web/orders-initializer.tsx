export type Order = {
  _id: string;
  price: number;
  status: string;
  products: [
    {
      product: string;
      name: string;
      quantity: number;
      _id: string;
    },
  ];
};

export function OrdersInitializer({ orders }: { orders: Order[] }) {
  return (
    <main className="max-w-150 mx-auto w-full">
      <div className="h-full flex flex-col gap-2 p-5">
        {orders.length ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col gap-2 border-2 border-accent rounded-lg p-5"
            >
              <h2 className="text-lg font-semibold">Order No. {order._id}</h2>
              <ul className="list-disc ml-5 text-sm">
                {order.products.map((product) => (
                  <li key={product._id}>
                    Name: {product.name}, Quantity: {product.quantity}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between flex-1 text-sm">
                <div>
                  Amount Paid: <span>${order.price}</span>
                </div>
                <div>
                  Status: <span>{order.status}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            No orders yet
          </div>
        )}
      </div>
    </main>
  );
}
