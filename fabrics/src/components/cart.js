import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
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
      .post('http://localhost:3999/checkout', { totalPrice }, { withCredentials: true })
      .then((response) => {
        setSuccessMessage('Checkout completed successfully!');
        setCartItems([]);
        setTotalPrice(0);
      })
      .catch((error) => {
        console.error('Error during checkout:', error);
        setErrorMessage('Checkout failed. Please try again.');
      });
  };

  return (
    <div>
      <div className="main-content">
        <div className="cart-container">
          <h2>Your Cart</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          {cartItems.length > 0 ? (
            <div>
              <ul className="cart-items">
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">
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
              <div className="cart-summary">
                <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                <button onClick={handleCheckout} className="checkout-button">
                  Checkout
                </button>
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
