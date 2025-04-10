import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_URL = 'http://localhost:5000';

function UserDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data);
  };

  const handleBuy = (product) => {
    axios.delete(`${API_URL}/products/${product.id}`);
    alert(`✅ You bought ${product.name} for ₹${product.price}`);
    fetchProducts();
  };

  return (
    <div className="container">
      <h2>User Dashboard</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="product-img"
              />
            )}
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button onClick={() => handleBuy(product)}>🛒 Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
