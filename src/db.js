import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Andrzej:PASSWORD@cluster0.sjoui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db('restauracja'); 
    console.log('Połączono z MongoDB');
  } catch (error) {
    console.error('Błąd połączenia z MongoDB:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Baza danych nie jest jeszcze połączona!');
  }
  return db;
};
