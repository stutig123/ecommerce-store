const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

const DATA_FILE = "./data/products.json";

app.use(express.json());
app.use(cors());

// Load products from file
const loadProducts = () => {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } else {
    return [];
  }
};

// Save products to file
const saveProducts = (products) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
};

// GET all products
app.get("/products", (req, res) => {
  res.json(loadProducts());
});

// ADD a new product
app.post("/products", (req, res) => {
  let products = loadProducts();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

// DELETE a product
app.delete("/products/:id", (req, res) => {
  let products = loadProducts();
  const filteredProducts = products.filter((p) => p.id !== parseInt(req.params.id));
  saveProducts(filteredProducts);
  res.json({ message: "Product deleted successfully" });
});

// UPDATE a product
app.put("/products/:id", (req, res) => {
  let products = loadProducts();
  const productIndex = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  products[productIndex] = { ...products[productIndex], ...req.body };
  saveProducts(products);
  res.json(products[productIndex]);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
