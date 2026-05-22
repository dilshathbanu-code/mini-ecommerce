import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    axios.get(`https://mini-ecommerce-cd3l.onrender.com/register/orders/${user_id}`).then(res => setOrders(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => router.push("/products")}>Back to Products</button>
      </div>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet!</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded shadow mb-4">
            <p className="font-bold">Order ID: {order._id}</p>
            <p className="text-gray-600">Date: {order.date}</p>
            <p className="text-green-600 font-bold">Status: {order.status}</p>
            <div className="mt-2">
              {order.items.map((item, i) => (
                <p key={i} className="text-gray-600">Product: {item.product_id} — Qty: {item.quantity}</p>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}