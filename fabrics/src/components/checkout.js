import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/checkout.css';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart items
    axios
      .get('http://localhost:3999/cart', { withCredentials: true })
      .then((response) => {
        setCartItems(response.data);
        const total = response.data.reduce((sum, item) => sum + item.PRICE * item.QUANTITY, 0);
        setTotalPrice(total);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
        setErrorMessage('Failed to load cart items. Please try again later.');
      });
  }, []);

  const handleCheckout = () => {
    axios
      .post(
        'http://localhost:3999/checkout',
        { totalPrice },
        { withCredentials: true }
      )
      .then(() => {
        alert('Checkout completed successfully!');
        navigate('/home'); // Redirect to home after checkout
      })
      .catch((error) => {
        console.error('Error during checkout:', error);
        setErrorMessage('Checkout failed. Please try again.');
      });
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {cartItems.length > 0 ? (
        <div>
          <ul className="checkout-items">
            {cartItems.map((item) => (
              <li key={item.STOCK_ID} className="checkout-item">
                <div>
                  <strong>{item.NAME}</strong> - {item.CATEGORY}
                </div>
                <div>
                  Quantity: {item.QUANTITY} | Price: ${item.PRICE.toFixed(2)}
                </div>
                <div>Total: ${(item.QUANTITY * item.PRICE).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className="checkout-summary">
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
            <button onClick={handleCheckout} className="checkout-button">
              Confirm Checkout
            </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CheckoutPage;
