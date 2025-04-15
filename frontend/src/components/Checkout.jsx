import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_URL = 'http://localhost:5000';

function Checkout({ cart, onOrderPlaced }) {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const validateCardDetails = () => {
    const { cardNumber, expiry, cvv } = cardDetails;
    if (
      cardNumber.length !== 16 ||
      !/^\d{16}$/.test(cardNumber) ||
      !/^\d{2}\/\d{2}$/.test(expiry) ||
      cvv.length !== 3 ||
      !/^\d{3}$/.test(cvv)
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'card' && !validateCardDetails()) {
      alert('Please enter valid card details.');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        products: cart.map((p) => p.id),
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? cardDetails : null,
      };
      await axios.post(`${API_URL}/orders`, orderData);
      onOrderPlaced();
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-modal">
      <h3>Checkout</h3>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Payment Method:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="card">Credit/Debit Card</option>
          </select>
        </label>

        {paymentMethod === 'card' && (
          <div className="card-details">
            <label>
              Card Number:
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                maxLength="16"
                placeholder="1234123412341234"
                required
              />
            </label>
            <label>
              Expiry (MM/YY):
              <input
                type="text"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleInputChange}
                maxLength="5"
                placeholder="MM/YY"
                required
              />
            </label>
            <label>
              CVV:
              <input
                type="password"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                maxLength="3"
                placeholder="123"
                required
              />
            </label>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
