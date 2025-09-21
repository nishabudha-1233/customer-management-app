// client/src/components/AddressList.js
import React from 'react';

function AddressList({ addresses, onDelete }) {
  return (
    <ul>
      {addresses.map(addr => (
        <li key={addr.id} className="address-card">
          {addr.address_details}, {addr.city}, {addr.state} - {addr.pin_code}
          <button onClick={() => onDelete(addr.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default AddressList;
