// client/src/pages/CustomerDetailPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: ""
  });

  // Fetch customer + addresses
  useEffect(() => {
    axios.get(`https://customer-management-app-zeta.vercel.app//api/customers/${id}`)
      .then(res => setCustomer(res.data))
      .catch(err => console.error(err));

    axios.get(`https://customer-management-app-zeta.vercel.app//api/customers/${id}/addresses`)
      .then(res => setAddresses(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit new or updated address
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      // Update existing address
      axios.put(`https://customer-management-app-zeta.vercel.app//api/addresses/${editingAddressId}`, formData)
        .then(res => {
          if (res.data.updated) {
            setAddresses(prev =>
              prev.map(addr =>
                addr.id === editingAddressId ? { ...addr, ...formData } : addr
              )
            );
          }
          setFormData({ address_details: "", city: "", state: "", pin_code: "" });
          setEditingAddressId(null);
          setShowForm(false);
        })
        .catch(err => console.error(err));
    } else {
      // Add new address
      axios.post(`https://customer-management-app-zeta.vercel.app//api/customers/${id}/addresses`, formData)
        .then(res => {
          setAddresses(prev => [...prev, res.data]);
          setFormData({ address_details: "", city: "", state: "", pin_code: "" });
          setShowForm(false);
        })
        .catch(err => console.error(err));
    }
  };

  // Edit button click
  const handleEdit = (addr) => {
    setEditingAddressId(addr.id);
    setFormData({
      address_details: addr.address_details,
      city: addr.city,
      state: addr.state,
      pin_code: addr.pin_code
    });
    setShowForm(true);
  };

  // Delete address
  const handleDelete = (addressId) => {
    axios.delete(`https://customer-management-app-zeta.vercel.app//api/addresses/${addressId}`)
      .then(res => {
        if (res.data.deleted) {
          setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="app-container">
      <h1>Customer Details</h1>
      <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
      <p><strong>Phone:</strong> {customer.phone_number}</p>

      <h2>Addresses</h2>
      <ul>
        {addresses.map(addr => (
          <li key={addr.id}>
            <span>
              {addr.address_details}, {addr.city}, {addr.state} - {addr.pin_code}
            </span>
            <span>
              <button className="button" onClick={() => handleEdit(addr)}>Edit</button>
              <button className="button" onClick={() => handleDelete(addr.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>

      <button className="button" onClick={() => { 
        setShowForm(!showForm); 
        setEditingAddressId(null); 
        setFormData({ address_details: "", city: "", state: "", pin_code: "" });
      }}>
        {showForm ? "Cancel" : "Add Address"}
      </button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label>Address Details: </label>
            <input className="input" type="text" name="address_details" value={formData.address_details} onChange={handleChange} required />
          </div>
          <div>
            <label>City: </label>
            <input className="input" type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div>
            <label>State: </label>
            <input className="input" type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>
          <div>
            <label>Pin Code: </label>
            <input className="input" type="text" name="pin_code" value={formData.pin_code} onChange={handleChange} required />
          </div>
          <button className="button" type="submit">
            {editingAddressId ? "Update Address" : "Save Address"}
          </button>
        </form>
      )}
    </div>
  );
}

export default CustomerDetailPage;
