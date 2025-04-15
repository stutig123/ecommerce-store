import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Checkout from './Checkout';

const API_URL = 'http://localhost:5000';

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [addedProductId, setAddedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL + '/products');
    setProducts(res.data);
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add products before checkout.');
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderPlaced = () => {
    alert('Order placed successfully!');
    setCart([]);
    setShowCheckout(false);
    fetchProducts();
  };

  return (
    <div className="container">
      <h2>User Dashboard</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image ? (
              <img
                src={API_URL + product.image}
                alt={product.name}
                className="product-img"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', marginBottom: '10px' }}
              />
            ) : (
              <div className="product-emoji" role="img" aria-label="package">
                📦
              </div>
            )}
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="buy-button"
              aria-label={`Buy ${product.name}`}
              disabled={addedProductId === product.id}
            >
              {addedProductId === product.id ? 'Added ✓' : 'Buy 🛒'}
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleCheckoutClick} className="checkout-button">
        Checkout {cart.length > 0 && <span className="cart-count">({cart.length})</span>}
      </button>
      {showCheckout && <Checkout cart={cart} onOrderPlaced={handleOrderPlaced} />}
    </div>
  );
}

export default UserDashboard;
