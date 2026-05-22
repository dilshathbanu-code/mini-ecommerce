from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import jwt
import datetime

app = Flask(__name__)
CORS(app, origins="*")

SECRET_KEY = "mysecretkey"

client = MongoClient("mongodb+srv://dilshathbanu107_db_user:JEpyRXytjXoOdxhF@clus.fglk4ke.mongodb.net/?retryWrites=true&w=majority&appName=Clus")

db = client["ecommerce"]

users_col = db["users"]
products_col = db["products"]
cart_col = db["cart"]
orders_col = db["orders"]

@app.route("/")
def home():
    return "Backend is running successfully"

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data["name"]
    email = data["email"]
    password = data["password"]
    if users_col.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    users_col.insert_one({"name": name, "email": email, "password": hashed, "role": "user"})
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]
    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found"}), 404
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"message": "Wrong password"}), 401
    token = jwt.encode({
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")
    return jsonify({"message": "Login successful", "token": token}), 200

@app.route("/products", methods=["GET"])
def get_products():
    products = list(products_col.find())
    for p in products:
        p["_id"] = str(p["_id"])
    return jsonify(products), 200

@app.route("/product/add", methods=["POST"])
def add_product():
    data = request.json
    products_col.insert_one({
        "name": data["name"],
        "price": data["price"],
        "description": data["description"],
        "image": data.get("image", "")
    })
    return jsonify({"message": "Product added successfully"}), 201

@app.route("/product/update/<id>", methods=["PUT"])
def update_product(id):
    data = request.json
    products_col.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": "Product updated successfully"}), 200

@app.route("/product/delete/<id>", methods=["DELETE"])
def delete_product(id):
    products_col.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Product deleted successfully"}), 200

@app.route("/cart/add", methods=["POST"])
def add_to_cart():
    data = request.json
    user_id = data["user_id"]
    product_id = data["product_id"]
    quantity = data.get("quantity", 1)
    existing = cart_col.find_one({"user_id": user_id, "product_id": product_id})
    if existing:
        cart_col.update_one({"user_id": user_id, "product_id": product_id}, {"$inc": {"quantity": quantity}})
    else:
        cart_col.insert_one({"user_id": user_id, "product_id": product_id, "quantity": quantity})
    return jsonify({"message": "Item added to cart"}), 201

@app.route("/cart/<user_id>", methods=["GET"])
def get_cart(user_id):
    items = list(cart_col.find({"user_id": user_id}))
    for item in items:
        item["_id"] = str(item["_id"])
    return jsonify(items), 200

@app.route("/cart/remove", methods=["DELETE"])
def remove_from_cart():
    data = request.json
    cart_col.delete_one({"user_id": data["user_id"], "product_id": data["product_id"]})
    return jsonify({"message": "Item removed from cart"}), 200

@app.route("/order/place", methods=["POST"])
def place_order():
    data = request.json
    user_id = data["user_id"]
    cart_items = list(cart_col.find({"user_id": user_id}))
    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 400
    orders_col.insert_one({
        "user_id": user_id,
        "items": [{"product_id": i["product_id"], "quantity": i["quantity"]} for i in cart_items],
        "status": "placed",
        "date": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    })
    cart_col.delete_many({"user_id": user_id})
    return jsonify({"message": "Order placed successfully"}), 201

@app.route("/orders/<user_id>", methods=["GET"])
def get_user_orders(user_id):
    orders = list(orders_col.find({"user_id": user_id}))
    for o in orders:
        o["_id"] = str(o["_id"])
    return jsonify(orders), 200

@app.route("/orders", methods=["GET"])
def get_all_orders():
    orders = list(orders_col.find())
    for o in orders:
        o["_id"] = str(o["_id"])
    return jsonify(orders), 200

if __name__ == "__main__":
    app.run(debug=True)