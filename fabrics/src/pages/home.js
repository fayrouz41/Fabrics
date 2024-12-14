import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import axios from 'axios';

function Home() {
  const [latestStock, setLatestStock] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch latest stocks
    axios
      .get('http://localhost:3999/stock?limit=5')
      .then((response) => {
        console.log('Fetched stock:', response.data);
        setLatestStock(response.data);
      })
      .catch((error) => console.error('Error fetching latest stock:', error));

    // Fetch categories
    axios
      .get('http://localhost:3999/stock/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div className="main-content">
      {/* Header Section */}
      <header className="header">
        <h1>Welcome to Fabrics App</h1>
        <p>Your connection hub for suppliers and manufacturers in the clothing industry.</p>
      </header>

      {/* Categories Section */}
      <section className="categories">
        <h2>Product Categories</h2>
        <div className="category-container">
          {categories.map((category, index) => (
            <Link to={`/category/${category}`} key={index} className="category-card">
              <p>{category}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="latest-products">
        <h2>Latest Added Products</h2>
        <div className="product-grid">
          {latestStock.length > 0 ? (
            latestStock.map((item) => (
              <div key={item.ID} className="product-card">
                {/* Render the stock image */}
                <img
                  src={item.PHOTOURL || 'placeholder.jpg'}
                  alt={item.NAME}
                  className="product-image"
                />
                <h3>{item.NAME}</h3>
                <p>Category: {item.CATEGORY}</p>
                <p>Price: ${item.PRICE}</p>
              </div>
            ))
          ) : (
            <p>No products found. Check back later!</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
