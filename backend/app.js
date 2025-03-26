import bodyParser from 'body-parser';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB, getDB } from './db.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret';

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Brak tokenu uwierzytelniającego' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const db = getDB();
    const user = await db.collection('users').findOne({ 
      email: decoded.email,
      _id: decoded.id
    });

    if (!user) {
      return res.status(401).json({ message: 'Użytkownik nie istnieje' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      message: 'Nieprawidłowy token',
      details: error.message 
    });
  }
};

app.use('/images', express.static('public/images'));

app.get('/api/meals', async (req, res) => {
  try {
    const db = getDB();
    if (!db) {
      throw new Error('Database connection not established');
    }

    const meals = await db.collection('meals')
      .find({})
      .project({ _id: 0 }) 
      .toArray();

    const result = meals.map(meal => ({
      ...meal,
      image: `${req.protocol}://${req.get('host')}/images/${meal.image.split('/').pop()}`
    }));

    res.json(result);
  } catch (error) {
    console.error('GET /api/meals error:', error);
    res.status(500).json({ 
      message: 'Błąd serwera',
      error: error.message 
    });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Nieprawidłowy format email' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Hasło musi mieć minimum 6 znaków' });
    }

    const db = getDB();
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Użytkownik już istnieje' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    const token = jwt.sign(
      { 
        email: newUser.email, 
        id: result.insertedId 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Użytkownik zarejestrowany',
      token,
      user: { 
        id: result.insertedId,
        email: newUser.email, 
        name: newUser.name 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Błąd rejestracji',
      error: error.message 
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email i hasło są wymagane' });
    }
    
    const db = getDB();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nieprawidłowe hasło' });
    }

    const token = jwt.sign(
      { 
        email: user.email, 
        id: user._id 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Logowanie udane',
      token,
      user: { 
        id: user._id,
        email: user.email, 
        name: user.name 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Błąd logowania',
      error: error.message 
    });
  }
});

app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const orderData = req.body.order;
    const userId = req.user._id;

    if (!orderData?.items?.length) {
      return res.status(400).json({ message: 'Brak pozycji w zamówieniu' });
    }

    const requiredFields = ['email', 'name', 'street', 'postal-code', 'city'];
    const missingFields = requiredFields.filter(field => !orderData.customer?.[field]?.trim());
    
    if (missingFields.length) {
      return res.status(400).json({
        message: `Brak wymaganych pól: ${missingFields.join(', ')}`
      });
    }

    if (!orderData.customer.email.includes('@')) {
      return res.status(400).json({ message: 'Nieprawidłowy email' });
    }

    const db = getDB();
    const newOrder = {
      ...orderData,
      userId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('orders').insertOne(newOrder);
    
    res.status(201).json({ 
      success: true,
      message: 'Zamówienie utworzone!',
      orderId: result.insertedId
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Błąd zapisu zamówienia',
      error: error.message 
    });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection('orders')
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .toArray();
      
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Błąd pobierania zamówień',
      error: error.message 
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Wewnętrzny błąd serwera',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

connectDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
    console.log(`Środowisko: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Dostępne endpointy:`);
    console.log(`- GET  http://localhost:${port}/api/meals`);
    console.log(`- POST http://localhost:${port}/api/register`);
    console.log(`- POST http://localhost:${port}/api/login`);
    console.log(`- POST http://localhost:${port}/api/orders (protected)`);
    console.log(`- GET  http://localhost:${port}/api/orders (protected)`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});