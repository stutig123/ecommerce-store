const express = require('express');
const router = express.Router();

let orders = []; // In-memory orders storage, replace with DB in production

// POST /orders - place a new order
router.post('/', (req, res) => {
  const { products, paymentMethod, cardDetails } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'No products in order' });
  }

  if (paymentMethod !== 'cod' && paymentMethod !== 'card') {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  if (paymentMethod === 'card') {
    if (
      !cardDetails ||
      typeof cardDetails.cardNumber !== 'string' ||
      cardDetails.cardNumber.length !== 16 ||
      !cardDetails.expiry ||
      !cardDetails.cvv
    ) {
      return res.status(400).json({ error: 'Invalid card details' });
    }
  }

  const order = {
    id: orders.length + 1,
    products,
    paymentMethod,
    cardDetails: paymentMethod === 'card' ? cardDetails : null,
    date: new Date(),
  };

  orders.push(order);

  // In a real app, you would also update product stock, send confirmation, etc.

  res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
});

module.exports = router;
