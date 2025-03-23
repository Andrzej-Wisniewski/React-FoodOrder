import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import { connectDB, getDB } from './db.js';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
  });
});

app.get('/meals', async (req, res) => {
  try {
    const db = getDB();
    const meals = await db.collection('meals').find().toArray();
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Błąd pobierania posiłków' });
  }
});


app.post('/orders', async (req, res) => {
  const orderData = req.body.order;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: 'Brak danych.' });
  }

  if (
    !orderData.customer.email.includes('@') ||
    !orderData.customer.name.trim() ||
    !orderData.customer.street.trim() ||
    !orderData.customer['postal-code'].trim() ||
    !orderData.customer.city.trim()
  ) {
    return res.status(400).json({
      message: 'Brak wymaganych danych: Email, imię, ulica, kod pocztowy lub miasto.',
    });
  }

  try {
    const db = getDB();
    const newOrder = {
      ...orderData,
      id: (Math.random() * 1000).toString(),
    };
    await db.collection('orders').insertOne(newOrder);
    res.status(201).json({ message: 'Zamówienie utworzone!' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd zapisu zamówienia' });
  }
});