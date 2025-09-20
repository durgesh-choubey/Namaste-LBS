const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;
const saltRounds = 10;

// Increase payload size limit for file uploads (e.g., 50MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// Custom CORS Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Initialize SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Error opening database", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.serialize(() => {
            // Create tables if they don't exist
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT UNIQUE,
                email TEXT UNIQUE,
                roomNo TEXT,
                courseName TEXT,
                departmentName TEXT,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'student'
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS machines (
                id TEXT PRIMARY KEY,
                model TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'available',
                lastMaintenance TEXT NOT NULL
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS bookings (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                machineId TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'upcoming',
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (machineId) REFERENCES machines(id) ON DELETE CASCADE
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                media TEXT,
                media_type TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS blocked_dates (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL UNIQUE,
                reason TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                filetype TEXT NOT NULL,
                data BLOB NOT NULL,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);


            // Add admin user if it doesn't exist
            const adminEmail = 'admin@hostel.com';
            db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, row) => {
                if (err) return console.error("DB Error:", err.message);
                if (!row) {
                    bcrypt.hash('password', saltRounds, (err, hash) => {
                        if (err) return console.error("Bcrypt Error:", err.message);
                        db.run('INSERT INTO users (id, name, role, email, password) VALUES (?, ?, ?, ?, ?)',
                            [`admin-${Date.now()}`, 'Admin', 'admin', adminEmail, hash],
                            (err) => {
                                if (err) console.error("Error creating admin user", err.message);
                                else console.log("Admin user created successfully.");
                            }
                        );
                    });
                }
            });
        });
    }
});


// --- AUTH ROUTES ---
app.post('/api/auth/signup/student', (req, res) => {
    const { name, phone, email, roomNo, courseName, departmentName, password } = req.body;
    if (!name || !phone || !password) {
        return res.status(400).json({ message: 'Name, phone, and password are required.' });
    }
    db.get('SELECT * FROM users WHERE phone = ? OR email = ?', [phone, email], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (row) return res.status(409).json({ message: 'User with this phone or email already exists.' });

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password.' });
            const newUserId = `user-${Date.now()}`;
            db.run('INSERT INTO users (id, name, phone, email, roomNo, courseName, departmentName, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [newUserId, name, phone, email, roomNo, courseName, departmentName, hash, 'student'],
                (err) => {
                    if (err) return res.status(500).json({ message: 'Failed to create user.' });
                    res.status(201).json({ message: 'User created successfully.' });
                }
            );
        });
    });
});

app.post('/api/auth/login/student', (req, res) => {
    const { phone, password } = req.body;
    db.get('SELECT * FROM users WHERE phone = ? AND role = ?', [phone, 'student'], (err, user) => {
        if (err || !user) return res.status(404).json({ message: 'Student not found or invalid credentials.' });
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const { password, ...userWithoutPassword } = user;
                res.json({ message: 'Login successful', user: userWithoutPassword });
            } else {
                res.status(401).json({ message: 'Invalid credentials.' });
            }
        });
    });
});

app.post('/api/auth/login/admin', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin'], (err, user) => {
        if (err || !user) return res.status(404).json({ message: 'Admin not found or invalid credentials.' });
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const { password, ...userWithoutPassword } = user;
                res.json({ message: 'Login successful', user: userWithoutPassword });
            } else {
                res.status(401).json({ message: 'Invalid credentials.' });
            }
        });
    });
});

// --- USER MANAGEMENT ROUTES ---
app.get('/api/users', (req, res) => {
    db.all('SELECT id, name, phone, email, roomNo, courseName, departmentName FROM users WHERE role = ?', ['student'], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

app.put('/api/users/:id', (req, res) => {
    const { name, email, phone, roomNo } = req.body;
    db.run('UPDATE users SET name = ?, email = ?, phone = ?, roomNo = ? WHERE id = ?', [name, email, phone, roomNo, req.params.id], function (err) {
        if (err) return res.status(500).json({ message: 'Failed to update user' });
        db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, user) => {
            const { password, ...userWithoutPassword } = user;
            res.json({ message: 'User updated', user: userWithoutPassword });
        });
    });
});

app.post('/api/users/change-password', (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ message: 'User not found.' });
        bcrypt.compare(currentPassword, user.password, (err, result) => {
            if (!result) return res.status(401).json({ message: 'Incorrect current password.' });
            bcrypt.hash(newPassword, saltRounds, (err, hash) => {
                db.run('UPDATE users SET password = ? WHERE id = ?', [hash, userId], (err) => {
                    if (err) return res.status(500).json({ message: 'Failed to update password.' });
                    res.json({ message: 'Password updated successfully.' });
                });
            });
        });
    });
});

// --- MACHINE ROUTES ---
app.get('/api/machines', (req, res) => {
    let query = 'SELECT * FROM machines';
    if(req.query.status){
        query += ` WHERE status = '${req.query.status}'`
    }
    db.all(query, [], (err, rows) => {
        if (err) res.status(500).json({ message: 'Database error' });
        else res.json(rows);
    });
});

app.post('/api/machines', (req, res) => {
    const { id, model, status, lastMaintenance } = req.body;
    db.run('INSERT INTO machines (id, model, status, lastMaintenance) VALUES (?, ?, ?, ?)', [id, model, status, lastMaintenance], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to add machine' });
        res.status(201).json({ id: this.lastID });
    });
});

app.put('/api/machines/:id', (req, res) => {
    const { model, status, lastMaintenance } = req.body;
    db.run('UPDATE machines SET model = ?, status = ?, lastMaintenance = ? WHERE id = ?', [model, status, lastMaintenance, req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to update machine' });
        res.json({ message: 'Machine updated' });
    });
});

app.delete('/api/machines/:id', (req, res) => {
    db.run('DELETE FROM machines WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to delete machine' });
        res.json({ message: 'Machine deleted' });
    });
});

// --- BOOKING ROUTES ---
app.get('/api/bookings', (req, res) => {
    const sql = `
        SELECT b.*, u.name as userName, u.roomNo as userRoom, u.phone as userPhone
        FROM bookings b
        JOIN users u ON b.userId = u.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

app.get('/api/bookings/user/:userId', (req, res) => {
    db.all('SELECT * FROM bookings WHERE userId = ?', [req.params.userId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

app.post('/api/bookings', (req, res) => {
    const { userId, machineId, date, time } = req.body;
    const bookingId = `book-${Date.now()}`;
    
    // Check if user has an existing upcoming booking
    db.get("SELECT * FROM bookings WHERE userId = ? AND status = 'upcoming'", [userId], (err, existingBooking) => {
        if (err) return res.status(500).json({ message: "Database error checking existing bookings." });
        if (existingBooking) return res.status(409).json({ message: "You already have an upcoming booking." });
        
        // Check if the slot is already taken
        db.get("SELECT * FROM bookings WHERE machineId = ? AND date = ? AND time = ?", [machineId, date, time], (err, slotTaken) => {
            if (err) return res.status(500).json({ message: "Database error checking slot." });
            if (slotTaken) return res.status(409).json({ message: "This slot is no longer available." });

            db.run('INSERT INTO bookings (id, userId, machineId, date, time, status) VALUES (?, ?, ?, ?, ?, ?)',
                [bookingId, userId, machineId, date, time, 'upcoming'],
                function(err) {
                    if (err) return res.status(500).json({ message: 'Failed to create booking' });
                    res.status(201).json({ message: 'Booking created', id: this.lastID });
                }
            );
        });
    });
});

app.delete('/api/bookings/:id', (req, res) => {
    db.run('DELETE FROM bookings WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to delete booking' });
        res.json({ message: 'Booking deleted' });
    });
});

// --- SLOTS AVAILABILITY ROUTE ---
app.get('/api/slots', (req, res) => {
    const { machineId, date } = req.query;
    if (!machineId || !date) return res.status(400).json({ message: 'Machine ID and date are required.' });
    
    // Fetch settings to generate time slots
    db.get("SELECT * FROM settings WHERE key IN ('start_time', 'end_time', 'slot_duration')", [], (err, settingsRow) => {
        let startTime = '09:00', endTime = '21:00';
        let slotDuration = 60;

        if (settingsRow) {
             db.all('SELECT key, value FROM settings', [], (err, settings) => {
                const settingsMap = new Map(settings.map(s => [s.key, s.value]));
                startTime = settingsMap.get('start_time') || '09:00';
                endTime = settingsMap.get('end_time') || '21:00';
                slotDuration = parseInt(settingsMap.get('slot_duration') || '60', 10);
                generateAndSendSlots();
             });
        } else {
            generateAndSendSlots();
        }

        function generateAndSendSlots() {
            const allSlots = [];
            let current = new Date(`${date}T${startTime}:00`);
            const end = new Date(`${date}T${endTime}:00`);

            while(current < end) {
                allSlots.push(current.toTimeString().substring(0, 5));
                current.setMinutes(current.getMinutes() + slotDuration);
            }
            
            db.all('SELECT time FROM bookings WHERE machineId = ? AND date = ?', [machineId, date], (err, bookedSlots) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                const bookedTimes = new Set(bookedSlots.map(s => s.time));
                const availableSlots = allSlots.map(time => ({
                    time,
                    available: !bookedTimes.has(time)
                }));
                res.json(availableSlots);
            });
        }
    });
});


// --- BLOCKED DATES ROUTES ---
app.get('/api/blocked-dates', (req, res) => {
    db.all('SELECT * FROM blocked_dates', [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

app.post('/api/blocked-dates', (req, res) => {
    const { date, reason } = req.body;
    const id = `block-${Date.now()}`;
    db.run('INSERT INTO blocked_dates (id, date, reason) VALUES (?, ?, ?)', [id, date, reason], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to block date.' });
        // After blocking, cancel all bookings for that date
        db.run('DELETE FROM bookings WHERE date = ?', [date], function(err) {
            if (err) console.error("Could not cancel bookings for blocked date:", err.message);
            res.status(201).json({ id });
        });
    });
});

app.delete('/api/blocked-dates/:id', (req, res) => {
    db.run('DELETE FROM blocked_dates WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to unblock date.' });
        res.json({ message: 'Date unblocked' });
    });
});

// --- NOTIFICATIONS ROUTES ---
app.get('/api/notifications', (req, res) => {
    db.all('SELECT * FROM notifications ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) res.status(500).json({ message: 'Database error' });
        else res.json(rows);
    });
});

app.post('/api/notifications', (req, res) => {
    const { subject, message, media, media_type } = req.body;
    const id = `notif-${Date.now()}`;
    db.run('INSERT INTO notifications (id, subject, message, media, media_type) VALUES (?, ?, ?, ?, ?)',
        [id, subject, message, media, media_type], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to send notification' });
        res.status(201).json({ id });
    });
});

app.delete('/api/notifications/:id', (req, res) => {
    db.run('DELETE FROM notifications WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to delete notification' });
        res.json({ message: 'Notification deleted' });
    });
});


// --- DOCUMENT ROUTES ---
app.get('/api/documents', (req, res) => {
    db.all('SELECT id, filename, filetype, uploaded_at FROM documents ORDER BY uploaded_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

app.get('/api/documents/:id', (req, res) => {
    db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!row) return res.status(404).json({ message: 'Document not found' });
        res.setHeader('Content-Type', row.filetype);
        res.send(row.data);
    });
});

app.post('/api/documents', (req, res) => {
    const { filename, filetype, data } = req.body;
    if (!filename || !filetype || !data) return res.status(400).json({ message: 'Missing file data' });
    
    const buffer = Buffer.from(data, 'base64');
    const id = `doc-${Date.now()}`;
    db.run('INSERT INTO documents (id, filename, filetype, data) VALUES (?, ?, ?, ?)',
        [id, filename, filetype, buffer], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to upload document' });
        res.status(201).json({ id });
    });
});

app.delete('/api/documents/:id', (req, res) => {
    db.run('DELETE FROM documents WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to delete document' });
        res.json({ message: 'Document deleted' });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`HostelWash backend server running on http://localhost:${port}`);
});
