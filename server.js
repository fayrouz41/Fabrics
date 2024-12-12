const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db_access = require('./db.js');
const db = db_access.db;
const cookieParser = require('cookie-parser');
const server = express();
const port = 3999;
const secret_key = 'hjgsdiuwesdhudwejdhdfha';

server.use(cors({
    origin: "http://localhost:3999",
    credentials: true
}));

server.use(express.json());
server.use(cookieParser());

server.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Generate JWT token
const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, secret_key, { expiresIn: '1h' });
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token)
        return res.status(401).send('unauthorized');
    jwt.verify(token, secret_key, (err, details) => {
        if (err)
            return res.status(403).send('invalid or expired token');
        req.userDetails = details;
        next();
    });
}

// User login
server.post('/user/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.get(`SELECT * FROM USER WHERE EMAIL=?`, [email], (err, row) => {
        if (err) {
            return res.status(500).send('error fetching user');
        }
        if (!row) {
            return res.status(401).send('invalid credentials');
        }
        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).send('error comparing password');
            }
            if (!isMatch) {
                return res.status(401).send('invalid credentials');
            }
            let userID = row.ID;
            let isAdmin = row.ISADMIN;
            const token = generateToken(userID, isAdmin);

            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expiresIn: '1h'
            });
            return res.status(200).json({ id: userID, admin: isAdmin });
        });
    });
});

// User registration
server.post('/user/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('error hashing password');
        }
        db.run(`INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, ?)`, [name, email, hashedPassword, 0], (err) => {
            if (err) {
                return res.status(401).send(err);
            }
            return res.status(200).send('Registration successful');
        });
    });
});

// Add a stock item (Admin only)
server.post('/stock/add', verifyToken, (req, res) => {
    const isAdmin = req.userDetails.isAdmin;
    if (isAdmin !== 1) return res.status(403).send('You are not an admin');

    const { name, category, description, price, supplierId } = req.body;

    const query = `INSERT INTO STOCK (NAME, CATEGORY, DESCRIPTION, PRICE, SUPPLIER_ID) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [name, category, description, price, supplierId], (err) => {
        if (err) {
            return res.status(500).send('Error adding stock item');
        }
        return res.send('Stock item added successfully');
    });
});

// View all stock
server.get('/stock', verifyToken, (req, res) => {
    const isAdmin = req.userDetails.isAdmin;
    if (isAdmin !== 1) return res.status(403).send('You are not an admin');

    const query = `SELECT * FROM STOCK`;
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).send('Error fetching stock');
        }
        return res.json(rows);
    });
});

// Search for stock based on filters
server.get('/stock/search', (req, res) => {
    let { name, category } = req.query;
    let query = `SELECT * FROM STOCK WHERE 1=1`;
    if (name) query += ` AND NAME LIKE '%${name}%'`;
    if (category) query += ` AND CATEGORY LIKE '%${category}%'`;

    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).send('Error searching stock');
        }
        return res.json(rows);
    });
});

// Create a cart (Assuming this is done by a user)
server.post('/cart', verifyToken, (req, res) => {
    const userID = req.userDetails.id;
    const { productId, manufacturerId, quantity, orderDate } = req.body;

    const query = `INSERT INTO CART (PRODUCT_ID, MANUFACTURER_ID, QUANTITY, ORDER_DATE) VALUES (?, ?, ?, ?)`;
    db.run(query, [productId, manufacturerId, quantity, orderDate], (err) => {
        if (err) {
            return res.status(500).send('Error adding to cart');
        }
        return res.send('Product added to cart');
    });
});

// Server startup
server.listen(port,'0.0.0.0', () => {
    console.log(`Server started at port ${port}`);
    db.serialize(() => {
        // Create tables
        db.run(db_access.createUserTable, (err) => {
            if (err) console.log("Error creating user table: " + err);
        });
        db.run(db_access.createSupplierTable, (err) => {
            if (err) console.log("Error creating supplier table: " + err);
        });
        db.run(db_access.createManufacturerTable, (err) => {
            if (err) console.log("Error creating manufacturer table: " + err);
        });
        db.run(db_access.createStockTable, (err) => {
            if (err) console.log("Error creating stock table: " + err);
        });
        db.run(db_access.createCartTable, (err) => {
            if (err) console.log("Error creating cart table: " + err);
        });

        // Insert admin user if not already exists
        db.run(db_access.insertAdminUser, (err) => {
            if (err) console.log("Error inserting admin user: " + err);
        });
    });
});
