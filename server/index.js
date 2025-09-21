// server/index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// ===============================
// CONNECT TO SQLITE DATABASE
// ===============================
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// ===============================
// CREATE TABLES IF NOT EXISTS
// ===============================
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        address_details TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pin_code TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )`);
});

// ===============================
// CUSTOMER ROUTES
// ===============================

// Create new customer
app.post('/api/customers', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
    db.run(sql, [first_name, last_name, phone_number], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, first_name, last_name, phone_number });
    });
});

// Get all customers (with optional search, sort, pagination)
app.get('/api/customers', (req, res) => {
    let { search, sortBy = "id", order = "ASC", page = 1, limit = 10 } = req.query;
    let offset = (page - 1) * limit;

    let sql = "SELECT * FROM customers";
    let params = [];

    if (search) {
        sql += " WHERE first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// Get single customer
app.get('/api/customers/:id', (req, res) => {
    const sql = "SELECT * FROM customers WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(row);
    });
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    const sql = `UPDATE customers SET first_name=?, last_name=?, phone_number=? WHERE id=?`;
    db.run(sql, [first_name, last_name, phone_number, req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

// Delete customer
app.delete('/api/customers/:id', (req, res) => {
    const sql = `DELETE FROM customers WHERE id=?`;
    db.run(sql, req.params.id, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// ===============================
// ADDRESS ROUTES
// ===============================

// Add new address for a customer
app.post('/api/customers/:id/addresses', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [req.params.id, address_details, city, state, pin_code], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, customer_id: req.params.id, address_details, city, state, pin_code });
    });
});

// Get all addresses of a customer
app.get('/api/customers/:id/addresses', (req, res) => {
    const sql = "SELECT * FROM addresses WHERE customer_id = ?";
    db.all(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// Update an address
app.put('/api/addresses/:addressId', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = `UPDATE addresses SET address_details=?, city=?, state=?, pin_code=? WHERE id=?`;
    db.run(sql, [address_details, city, state, pin_code, req.params.addressId], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});

// Delete an address
app.delete('/api/addresses/:addressId', (req, res) => {
    const sql = `DELETE FROM addresses WHERE id=?`;
    db.run(sql, req.params.addressId, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});




// ===============================
// START SERVER
// ===============================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
