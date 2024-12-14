import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/addstock.css';

const AddStock = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    description: '',
    price: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
      setErrorMessage('All fields except description are required!');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3999/stock/add',
        {
          ...formData,
          quantity: parseInt(formData.quantity, 10),
          price: parseFloat(formData.price),
          supplierId: 1,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage('Stock added successfully!');
        setFormData({ name: '', category: '', quantity: '', description: '', price: '' });
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      setErrorMessage('An error occurred while adding stock. Please try again.');
    }
  };

  return (
    <div>
      <div className="main-content">
        <div className="add-stock-container">
          <h2>Add Stock</h2>
          <form onSubmit={handleSubmit} className="add-stock-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <button type="submit">Add Stock</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
