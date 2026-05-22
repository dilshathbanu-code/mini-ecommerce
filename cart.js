import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    axios.get(`http://127.0.0.1:5000/cart/${user_id}`).then(res => setCartItems(res.data));
  }, []);

  const placeOrder = async () => {
    const user_id = localStorage.getItem("user_id");
    await axios.post("http://127.0.0.1:5000/order/place", { user_id });
    alert("Order placed successfully!");
    router.push("/orders");
  };

  const removeItem = async (product_id) => {
    const user_id = localStorage.getItem("user_id");
    await axios.delete("https://mini-ecommerce-cd3l.onrender.com/register/cart/remove", { data: { user_id, product_id } });
    setCartItems(cartItems.filter(item => item.product_id !== product_id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Cart</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => router.push("/products")}>Back to Products</button>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty!</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item._id} className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
              <div>
                <p className="font-bold">Product ID: {item.product_id}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => removeItem(item.product_id)}>Remove</button>
            </div>
          ))}
          <button className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 mt-4" onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
}