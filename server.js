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

const adminEMAIL= 'fayrouz@gmail.com'
const adminPASSWORD= bcrypt.hashSync('Fayrouz', 10);


// Admin login
server.post('/admin/login', (req, res) => {
    const {EMAIL, PASSWORD} = req.body;
    if (EMAIL == adminEMAIL){
        bcrypt.compare(PASSWORD, adminPASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).send('error comparing password');
            }
            if (!isMatch) {
                return res.status(401).send('invalid credentials');
            } 
            const token = generateToken(1, 'admin');

            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: true, 
                expiresIn: '1h' 
            });
    
            return res.status(200).json({ id: 1, role: 'admin' });
         });
        } else {
            res.status(401).send('Invalid credentials');  
    } 
        
});

server.post('/supplier/login', (req,res) => {   
    const email = req.body.email;
    const password = req.body.password;
    db.get(`SELECT * FROM SUPPLIER WHERE EMAIL=?`, [email], (err, row) => {
        if (err) {
            return res.status(500).send('error fetching supplier');
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
            const token = generateToken(row.ID, 'supplier'); 

            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
                expiresIn: '1h'
            });

            return res.status(200).json({ id: row.ID, role: 'supplier' });
        });
    });
});

//Manufacturer login
server.post('/manufacturer/login', (req,res) => {   
    const email = req.body.email;
    const password = req.body.password;
    db.get(`SELECT * FROM MANUFACTURER WHERE EMAIL=?`, [email], (err, row) => {
        if (err) {
            return res.status(500).send('error fetching supplier');
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

            const token = generateToken(row.ID, 'manufacturer');
            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expiresIn: '1h'
            });
            return res.status(200).json({ id: row.ID, role: 'manufacturer'});
        });
    });
});

server.get('/stock', verifyRole(['admin']), (req, res) => {
    const query = `SELECT * FROM STOCK`;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).send('Error fetching stock');
        return res.json(rows);
    });
});

server.post('/supplier/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('error hashing password');
        }
        db.run(`INSERT INTO SUPPLIER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, ?)`, [name, email, hashedPassword, 0], (err) => {
            if (err) {
                return res.status(401).send(err);
            }
            return res.status(200).send('Registration successful');
        });
    });
});

// Manufacturer registration
server.post('/manufacturer/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('error hashing password');
        }
        db.run(`INSERT INTO MANUFACTURER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, ?)`, [name, email, hashedPassword, 0], (err) => {
            if (err) {
                return res.status(401).send(err);
            }
            return res.status(200).send('Registration successful');
        });
    });
});

// View all stock
server.get('/stock',  verifyRole(['admin']), (req, res) => {

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

// Admin or Supplier can add stock
server.post('/stock/add', verifyRole(['admin', 'supplier']), (req, res) => {
    const { name, category, description, price, supplierId } = req.body;

    if (!name || !category || !price || !supplierId) {
        return res.status(400).send('Missing required fields');
    }

    const query = `INSERT INTO STOCK (NAME, CATEGORY, DESCRIPTION, PRICE, SUPPLIER_ID) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [name, category, description, price, supplierId], (err) => {
        if (err) {
            console.error('Error adding stock:', err);
            return res.status(500).send('Error adding stock item');
        }
        return res.send('Stock item added successfully');
    });
});

// Create a cart 
server.post('/cart',  verifyRole(['admin', 'supplier', 'manufaturer']), (req, res) => {

    const query = `INSERT INTO CART (STOCK_ID, MANUFACTURER_ID, QUANTITY, ORDER_DATE) VALUES (?, ?, ?, ?)`;
    db.run(query, [stockId, manufacturerId, quantity, orderDate], (err) => {
        if (err) {
            return res.status(500).send('Error adding to cart');
        }
        return res.send('Stock added to cart');
    });
});

// Server startup
server.listen(port,'0.0.0.0', () => {
    console.log(`Server started at port ${port}`);
    db.serialize(() => {
        // Create tables
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
    });
});
