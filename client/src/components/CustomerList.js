// client/src/components/CustomerList.js
import React from 'react';
import { Link } from 'react-router-dom';

function CustomerList({ customers, onDelete }) {
  return (
    <ul>
      {customers.map(customer => (
        <li key={customer.id}>
          <Link to={`/customers/${customer.id}`}>
            {customer.first_name} {customer.last_name} ({customer.phone_number})
          </Link>
          <button onClick={() => onDelete(customer.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default CustomerList;
