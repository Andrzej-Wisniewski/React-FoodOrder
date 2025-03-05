import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/meals', async (req, res) => {
  const meals = await fs.readFile('./data/available-meals.json', 'utf8');
  res.json(JSON.parse(meals));
});

app.post('/orders', async (req, res) => {
  const orderData = req.body.order;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (orderData === null || orderData.items === null || orderData.items.length === 0) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes('@') ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === '' ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === '' ||
    orderData.customer['postal-code'] === null ||
    orderData.customer['postal-code'].trim() === '' ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ''
  ) {
    return res
      .status(400)
      .json({ message: 'Missing data: Email, name, street, postal code or city is missing.' });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };

  const orders = await fs.readFile('./data/orders.json', 'utf8');
  const allOrders = JSON.parse(orders);
  allOrders.push(newOrder);
  await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));

  res.status(201).json({ message: 'Order created!' });
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    !name.trim() ||
    !password.trim()
  ) {
    return res.status(400).json({
      message: 'Invalid data. Name, email or password missing.',
    });
  }

  const usersData = await fs.readFile('./data/users.json', 'utf8');
  const allUsers = JSON.parse(usersData);

  const existingUser = allUsers.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      message: 'User with this email already exists.',
    });
  }

  const newUser = {
    id: (Math.random() * 100000).toFixed(0),
    name: name.trim(),
    email: email.trim(),
    password: password.trim(), 
  };

  allUsers.push(newUser);
  await fs.writeFile('./data/users.json', JSON.stringify(allUsers));

  const mockToken = 'mocked-jwt-token-' + newUser.id;

  res.status(201).json({
    token: mockToken,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@') || !password || !password.trim()) {
    return res
      .status(400)
      .json({ message: 'Invalid login data. Email or password missing.' });
  }

  const usersData = await fs.readFile('./data/users.json', 'utf8');
  const allUsers = JSON.parse(usersData);

  const existingUser = allUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (!existingUser) {
    return res.status(401).json({
      message: 'Could not authenticate. Wrong email or password.',
    });
  }

  const mockToken = 'mocked-jwt-token-' + existingUser.id;

  res.json({
    token: mockToken,
    user: {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    },
  });
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  res.status(404).json({ message: 'Not found' });
});

app.listen(3000, () => {
  console.log('API listening on http://localhost:3000');
});
