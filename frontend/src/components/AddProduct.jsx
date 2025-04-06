import { useState } from 'react';
import axios from 'axios';

function AddProduct({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      const uploadRes = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      imageUrl = uploadRes.data.imageUrl;
    }

    const product = { name, price, image: imageUrl };
    await axios.post('http://localhost:5000/products', product);
    onProductAdded();
    setName('');
    setPrice('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProduct;
