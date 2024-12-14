import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import axios from 'axios';

function Home() {
  const [latestStock, setLatestStock] = useState([]);

  useEffect(() => {

    axios
      .get('http://localhost:3999/stock?limit=5')
      .then(response => setLatestStock(response.data))
      .catch(error => console.error('Error fetching latest stock:', error));
  }, []);

  return (
    <div className="main-content">
      
      <header className="header">
        <h1>Welcome to Fabrics App</h1>
        <p>Your connection hub for suppliers and manufacturers in the clothing industry.</p>
      </header>

      
      <div className="container">
        <h2>Latest Added Stock</h2>
        {latestStock.length > 0 ? (
          <ul>
            {latestStock.map((item, index) => (
              <li key={index}>
                <strong>{item.NAME}</strong> - {item.CATEGORY} - {item.QUANTITY} units - ${item.PRICE}
              </li>
            ))}
          </ul>
        ) : (
          <p>No stock items found. Check back later!</p>
        )}
      </div>
    </div>
  );
}

export default Home;
