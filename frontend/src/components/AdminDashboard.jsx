import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_URL = 'http://localhost:5000';

function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL + '/products');
    setProducts(res.data);
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.post(API_URL + '/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData({ name: '', price: '', image: null });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await axios.delete(API_URL + '/products/' + id);
      fetchProducts();
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          required
        />
        <button type="submit" className="add-product-button">Add Product</button>
      </form>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img
                src={API_URL + product.image}
                alt={product.name}
                className="product-img"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', marginBottom: '10px' }}
              />
            )}
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button onClick={() => deleteProduct(product.id)} className="delete-button">❌ Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
