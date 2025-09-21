// client/src/pages/CustomerFormPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CustomerFormPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/customers', {
      first_name: firstName,
      last_name: lastName,
      phone_number: phone
    })
      .then(res => {
        alert('Customer added!');
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="app-container">
      <h1>Add Customer</h1>
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
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}

export default CustomerFormPage;
