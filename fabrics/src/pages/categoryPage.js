import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/category.css';

function CategoryPage() {
  const { category } = useParams(); // Get the category from the URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch products for the selected category
    axios
      .get(`http://localhost:3999/stock/category/${category}`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching category products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="main-content">
      <header className="header">
        <h1>Products in "{category}" Category</h1>
      </header>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.ID} className="product-card">
              <img
                src={product.PHOTOURL || 'placeholder.jpg'}
                alt={product.NAME}
                className="product-image"
              />
              <h3>{product.NAME}</h3>
              <p>Price: ${product.PRICE}</p>
              <p>Quantity: {product.QUANTITY}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
}

export default CategoryPage;
