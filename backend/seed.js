import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Andrzej:PASSWORD@cluster0.sjoui.mongodb.net/foodApp?retryWrites=true&w=majority";

const seedDatabase = async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('foodApp');
    await db.collection('meals').insertMany(sampleMeals);
    console.log('Dane zostały dodane do MongoDB');
  } catch (error) {
    console.error('Błąd dodawania danych:', error);
  } finally {
    await client.close();
  }
};

seedDatabase();
