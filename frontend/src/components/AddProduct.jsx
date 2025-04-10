import { useState } from 'react';
import axios from 'axios';

function AddProduct({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onProductAdded();
      setName('');
      setPrice('');
      setImage(null);
    } catch (err) {
      console.error('Error uploading product:', err);
      alert('Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        required
      />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProduct;
