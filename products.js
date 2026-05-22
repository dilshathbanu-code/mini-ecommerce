import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Products() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/products").then(res => setProducts(res.data));
  }, []);

  const addToCart = async (product_id) => {
    const user_id = localStorage.getItem("user_id");
    await axios.post("http://127.0.0.1:5000/cart/add", { user_id, product_id, quantity: 1 });
    alert("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <div>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600" onClick={() => router.push("/cart")}>Cart</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => { localStorage.clear(); router.push("/"); }}>Logout</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p._id} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{p.name}</h2>
            <p className="text-gray-600 mb-2">{p.description}</p>
            <p className="text-green-600 font-bold mb-4">₹{p.price}</p>
            <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={() => addToCart(p._id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}