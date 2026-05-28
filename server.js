const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const PORT = 3000;
const SECRET_KEY = 'phantom-shield-super-secret-key';

// In-memory database
const db = {
  users: [], // { id, name, email, password, role }
  devices: [], // { id, name, owner, type, status, risk, lastActivity, logs: [] }
  alerts: [], // { id, type, severity, timestamp, status, deviceId, ipAddress, openedTabs: [], suspiciousBehaviors: [], highAlertReason }
  recommendations: [], // { id, title, severity, explanation, action, applied }
  feed: [] // { title, time, body }
};

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role
  };

  db.users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, name: user.name, role: user.role, email: user.email }, SECRET_KEY);
  res.json({ token, user: { name: user.name, role: user.role, email: user.email } });
});

// Protected API Routes
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({
    devices: db.devices,
    alerts: db.alerts,
    recommendations: db.recommendations,
    feed: db.feed
  });
});

app.post('/api/devices', authenticateToken, (req, res) => {
  const newDevice = {
    id: Date.now().toString(),
    ...req.body,
    logs: []
  };
  db.devices.push(newDevice);
  res.status(201).json(newDevice);
});

app.post('/api/alerts', authenticateToken, (req, res) => {
  const newAlert = {
    id: Date.now().toString(),
    ...req.body
  };
  db.alerts.push(newAlert);
  res.status(201).json(newAlert);
});

app.patch('/api/alerts/:id', authenticateToken, (req, res) => {
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  
  if (req.body.status) alert.status = req.body.status;
  res.json(alert);
});

app.patch('/api/recommendations/:id', authenticateToken, (req, res) => {
  const rec = db.recommendations.find(r => r.id === req.params.id);
  if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
  
  if (req.body.applied !== undefined) rec.applied = req.body.applied;
  res.json(rec);
});

app.post('/api/feed', authenticateToken, (req, res) => {
  const newFeed = req.body;
  db.feed.unshift(newFeed);
  res.status(201).json(newFeed);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
