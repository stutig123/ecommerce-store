import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  const addProduct = async () => {
    await axios.post("http://localhost:5000/products", newProduct);
    setNewProduct({ name: "", price: "" });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/products/${id}`);
    fetchProducts();
  };

  const updateProduct = async () => {
    await axios.put(`http://localhost:5000/products/${editProduct.id}`, editProduct);
    setEditProduct(null);
    fetchProducts();
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {editProduct?.id === product.id ? (
              <>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                />
                <button className="edit-btn" onClick={updateProduct}>Save</button>
                <button className="delete-btn" onClick={() => setEditProduct(null)}>Cancel</button>
              </>
            ) : (
              <>
                {product.name} - ${product.price}
                <button className="edit-btn" onClick={() => setEditProduct(product)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <button className="add-btn" onClick={addProduct}>Add</button>
    </div>
  );
};

export default Home;
