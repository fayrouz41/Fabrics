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
    origin: "http://localhost:3000",
    methods: ['GET','POST', 'DELETE'],
    credentials: true
}));

server.use(express.json());
server.use(cookieParser());

server.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, secret_key, { expiresIn: '1h' });
}

// Middleware to verify token and extract role
const verifyRole = (requiredRoles) => (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send('Unauthorized: No token provided');

    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) return res.status(403).send('Invalid or expired token');

        req.userDetails = decoded;
        if (!requiredRoles.includes(decoded.role)) {
            return res.status(403).send('Forbidden: Insufficient permissions');
        }
        next();
    });
};

const adminEMAIL = 'fayrouz@gmail.com';
const adminPASSWORD = bcrypt.hashSync('Fayrouz', 10);

// Admin login
server.post('/admin/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('Email and password are required.');
    }

    if (email === adminEMAIL) {
        bcrypt.compare(password, adminPASSWORD, (err, isMatch) => {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).send('Error comparing password.');
            }
            if (!isMatch) {
                return res.status(401).send('Invalid credentials.');
            }

            const token = generateToken(1, 'admin');

            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, // 1 hour
            });

            return res.status(200).json({ id: 1, role: 'admin' });
        });
    } else {
        return res.status(401).json('Invalid credentials.');
    }
});


// Supplier login
server.post('/supplier/login', (req, res) => {
    console.log('Raw body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }

    db.get(`SELECT * FROM SUPPLIER WHERE EMAIL=?`, [email], (err, row) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Error fetching supplier');
        }
        if (!row) {
            return res.status(401).send('Invalid credentials');
        }

        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).send('Error comparing password');
            }
            if (!isMatch) {
                return res.status(401).send('Invalid credentials');
            }

            const token = generateToken(row.ID, 'supplier');

            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
                expiresIn: '1h'
            });

            return res.status(200).json({ id: row.ID, role: 'supplier' });
        });
    });
});

// Manufacturer login
server.post('/manufacturer/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM MANUFACTURER WHERE EMAIL=?`, [email], (err, row) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Error fetching manufacturer');
        }
        if (!row) {
            return res.status(401).send('Invalid credentials');
        }

        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).send('Error comparing password');
            }
            if (!isMatch) {
                return res.status(401).send('Invalid credentials');
            }

            const token = generateToken(row.ID, 'manufacturer');
            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
                expiresIn: '1h'
            });

            return res.status(200).json({ id: row.ID, role: 'manufacturer' });
        });
    });
});

// Supplier registration
server.post('/supplier/register', (req, res) => {
    const { name, email, password, contact_info } = req.body;

    if (!name || !email || !password || !contact_info) {
        return res.status(400).send('All fields are required');
    }

    db.get(`SELECT EMAIL FROM SUPPLIER WHERE EMAIL = ?`, [email], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        if (row) {
            return res.status(400).send('Email already in use');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Error hashing password');
            }

            db.run(
                `INSERT INTO SUPPLIER (NAME, EMAIL, PASSWORD, CONTACT_INFO) VALUES (?, ?, ?, ?)`,
                [name, email, hashedPassword, contact_info],
                (err) => {
                    if (err) {
                        console.error('Error inserting supplier:', err);
                        return res.status(500).send('Database constraint violation');
                    }
                    return res.status(201).send('Registration successful');
                }
            );
        });
    });
});

// Manufacturer registration
server.post('/manufacturer/register', (req, res) => {
    const { name, email, password, contact_info } = req.body;

    if (!name || !email || !password || !contact_info) {
        return res.status(400).send('All fields are required');
    }

    db.get(`SELECT EMAIL FROM MANUFACTURER WHERE EMAIL = ?`, [email], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        if (row) {
            return res.status(400).send('Email already in use');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Error hashing password');
            }

            db.run(
                `INSERT INTO MANUFACTURER (NAME, EMAIL, PASSWORD, CONTACT_INFO) VALUES (?, ?, ?, ?)`,
                [name, email, hashedPassword, contact_info],
                (err) => {
                    if (err) {
                        console.error('Error inserting manufacturer:', err);
                        return res.status(500).send('Database constraint violation');
                    }
                    return res.status(201).send('Registration successful');
                }
            );
        });
    });
});

// View all stock or latest stock
server.get('/stock', (req, res) => {
    const { limit } = req.query; 
    let query = `SELECT * FROM STOCK ORDER BY ID DESC`; 

    if (limit) {
        query += ` LIMIT ${parseInt(limit, 10)}`; 
    }

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching stock:', err);
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
            console.error('Error searching stock:', err);
            return res.status(500).send('Error searching stock');
        }
        return res.json(rows);
    });
});

// Admin or Supplier can add stock
server.post('/stock/add', verifyRole(['admin', 'supplier']), (req, res) => {
    const { name, category, quantity, description, price, supplierId } = req.body;
    if (!name || !category || !quantity || !price || !supplierId) {
        return res.status(400).send('Missing required fields');
    }

    const query = `INSERT INTO STOCK (NAME, CATEGORY, QUANTITY, DESCRIPTION, PRICE, SUPPLIER_ID) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, category, quantity, description, price, supplierId], (err) => {
        if (err) {
            console.error('Error adding stock:', err);
            return res.status(500).send('Error adding stock item');
        }
        return res.send('Stock item added successfully');
    });
});

// Create a cart
server.post('/cart', verifyRole(['admin', 'supplier', 'manufacturer']), (req, res) => {
    const { stockId, manufacturerId, quantity } = req.body;

    if (!stockId || !manufacturerId || !quantity) {
        return res.status(400).send('Missing required fields');
    }

    const orderDate = new Date().toISOString().split('T')[0];

    const query = `INSERT INTO CART (STOCK_ID, MANUFACTURER_ID, QUANTITY, ORDER_DATE) VALUES (?, ?, ?, ?)`;
    db.run(query, [stockId, manufacturerId, quantity, orderDate], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error adding to cart');
        }
        return res.send('Stock added to cart');
    });
});

// Checkout
server.post('/checkout', verifyRole(['supplier', 'manufacturer']), (req, res) => {
    const { manufacturerId, totalPrice } = req.body;
    if (!manufacturerId || !totalPrice) {
        return res.status(400).send('Missing required fields');
    }

    const query = `UPDATE CART SET STATUS = 'completed' WHERE MANUFACTURER_ID = ?`;
    db.run(query, [manufacturerId], (err) => {
        if (err) {
            console.error('Error completing checkout:', err);
            return res.status(500).send('Error completing checkout');
        }
        return res.send('Checkout completed');
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);

    db.serialize(() => {
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
        db.run(db_access.createOrdersTable, (err) => {
            if (err) console.log("Error creating order table: " + err);
        });
        db.run(db_access.createOrderItemsTable, (err) => {
            if (err) console.log("Error creating order table: " + err);
        });
    });
});