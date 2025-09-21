// client/src/pages/CustomerListPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CustomerListPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('https://customer-management-app-zeta.vercel.app/api/customers')
      .then(response => {
        setCustomers(response.data); // API returns { message, data }
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="app-container">
      <h1>Customer List</h1>
      <Link to="/customers/new">
        <button className="form-button">Add New Customer</button>
      </Link>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>
            <Link to={`/customers/${customer.id}`}>
              {customer.first_name} {customer.last_name} ({customer.phone_number})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerListPage;
