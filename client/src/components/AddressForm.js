import React, { useState } from 'react';
import axios from 'axios';

function AddressForm({ customerId, onAdd }) {
  const [addressDetails, setAddressDetails] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`https://customer-management-app-zeta.vercel.app/api/customers/${customerId}/addresses`, {
      street: addressDetails,
      city,
      state,
      zip: pinCode
    })
    .then(() => {
      setAddressDetails('');
      setCity('');
      setState('');
      setPinCode('');
      onAdd(); // refresh addresses
    })
    .catch(err => console.error(err));
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Address Details: </label>
        <input
          className="form-input"
          type="text"
          placeholder="Address"
          value={addressDetails}
          onChange={e => setAddressDetails(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">City: </label>
        <input
          className="form-input"
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">State: </label>
        <input
          className="form-input"
          type="text"
          placeholder="State"
          value={state}
          onChange={e => setState(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Pin Code: </label>
        <input
          className="form-input"
          type="text"
          placeholder="Pin Code"
          value={pinCode}
          onChange={e => setPinCode(e.target.value)}
          required
        />
      </div>
      <button className="form-button" type="submit">Add Address</button>
    </form>
  );
}

export default AddressForm;
