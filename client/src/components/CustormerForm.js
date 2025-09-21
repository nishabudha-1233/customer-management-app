// client/src/components/CustomerForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerForm({ customerId, onSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Fetch existing customer data if editing
  useEffect(() => {
    if (customerId) {
      axios.get(`https://customer-management-app-zeta.vercel.app/api/customers/${customerId}`)
        .then(res => {
          setFirstName(res.data.first_name);
          setLastName(res.data.last_name);
          setPhone(res.data.phone_number);
        })
        .catch(err => console.error(err));
    }
  }, [customerId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phone
    };

    if (customerId) {
      // Update existing customer
      axios.put(`https://customer-management-app-zeta.vercel.app/api/customers/${customerId}`, payload)
        .then(() => onSuccess())
        .catch(err => console.error(err));
    } else {
      // Create new customer
      axios.post(`https://customer-management-app-zeta.vercel.app/api/customers`, payload)
        .then(() => onSuccess())
        .catch(err => console.error(err));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
      />
      <button type="submit">{customerId ? 'Update Customer' : 'Add Customer'}</button>
    </form>
  );
}

export default CustomerForm;
