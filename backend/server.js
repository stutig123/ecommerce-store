require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ordersRouter = require('./routes/orders');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File paths
const productsPath = path.join(__dirname, 'data', 'products.json');
const usersPath = path.join(__dirname, 'data', 'users.json');

// Multer local storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      console.log('Uploads directory created');
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use('/orders', ordersRouter);

// ================= USER AUTH =================

// Login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, role: user.role, name: user.name });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Signup
app.post('/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath));

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const newUser = { name, email, password, role };
  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.json({ success: true, message: 'Signup successful' });
});

// ================= PRODUCTS =================

// Get all products
app.get('/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsPath));
  res.json(products);
});

// Add new product (admin only)
app.post('/products', upload.single('image'), (req, res) => {
  try {
    console.log('Received product add request');
    const { name, price } = req.body;
    console.log('Product name:', name, 'Price:', price);
    if (!req.file) {
      console.log('No image file uploaded');
    } else {
      console.log('Image file:', req.file.filename);
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null; // local image path
    const products = JSON.parse(fs.readFileSync(productsPath));
    const newProduct = { id: Date.now(), name, price, image };
    products.push(newProduct);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.json(newProduct);
  } catch (error) {
    console.error('Error in /products POST:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete product (admin only)
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  let products = JSON.parse(fs.readFileSync(productsPath));
  products = products.filter(p => p.id != id);
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  res.sendStatus(204);
});

// Update product (admin only)
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  let products = JSON.parse(fs.readFileSync(productsPath));
  products = products.map(p => (p.id == id ? { ...p, name, price } : p));
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  res.sendStatus(200);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
