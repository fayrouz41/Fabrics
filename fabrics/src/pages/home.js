import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import axios from 'axios';

function Home() {
  const [latestStock, setLatestStock] = useState([]);
  const [latestSuppliers, setLatestSuppliers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3999/stock?limit=5')
      .then(response => setLatestStock(response.data))
      .catch(error => console.error('Error fetching latest stock:', error));

    axios.get('http://localhost:3999/suppliers/latest')
      .then(response => setLatestSuppliers(response.data))
      .catch(error => console.error('Error fetching latest suppliers:', error));
  }, []);

  return (
    <div>
      
      <div className="main-content">
        <header className="header">
          <h1>Welcome to Fabrics App</h1>
          <p>Your connection hub for suppliers and manufacturers in the clothing industry.</p>
        </header>
        <div className="container">
          <h2>Latest Added Stock</h2>
          <ul>
            {latestStock.map((item, index) => (
              <li key={index}>
                <strong>{item.NAME}</strong> - {item.CATEGORY} - {item.QUANTITY} units - ${item.PRICE}
              </li>
            ))}
          </ul>
          <h2>Latest Suppliers and Their Stock</h2>
          {latestSuppliers.map((supplier, index) => (
            <div key={index} className="supplier-card">
              <h3>{supplier.NAME}</h3>
              <p>Contact: {supplier.CONTACT_INFO}</p>
              <h4>Stock:</h4>
              <ul>
                {supplier.stock.map((stockItem, stockIndex) => (
                  <li key={stockIndex}>
                    <strong>{stockItem.NAME}</strong> - {stockItem.CATEGORY} - {stockItem.QUANTITY} units - ${stockItem.PRICE}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
