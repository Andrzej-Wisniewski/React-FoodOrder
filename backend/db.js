import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://Andrzej:PASSWORD@cluster0.sjoui.mongodb.net/foodApp?retryWrites=true&w=majority';
const client = new MongoClient(uri);

let db;

const sampleMeals = [
  {
    "id": "m1",
    "name": "Makaron z serem",
    "price": "28.99",
    "description": "Kremowy ser cheddar wymieszany z doskonale ugotowanym makaronem, posypany chrupiącą bułką tartą. Klasyczne danie na pocieszenie.",
    "image": "images/mac-and-cheese.jpg"
  },
  {
    "id": "m2",
    "name": "Pizza Margherita",
    "price": "24.99",
    "description": "Klasyczna pizza z świeżą mozzarellą, pomidorami i bazylią na cienkim, chrupiącym cieście.",
    "image": "images/margherita-pizza.jpg"
  },
  {
    "id": "m3",
    "name": "Sałatka Cezar",
    "price": "24.99",
    "description": "Sałata rzymska w sosie Cezar, posypana grzankami i wiórkami parmezanu.",
    "image": "images/caesar-salad.jpg"
  },
  {
    "id": "m4",
    "name": "Spaghetti Carbonara",
    "price": "29.99",
    "description": "Makaron spaghetti al dente z kremowym sosem z żółtek jaj, sera pecorino, pancetty i pieprzu.",
    "image": "images/spaghetti-carbonara.jpg"
  },
  {
    "id": "m5",
    "name": "Burger wegetariański",
    "price": "29.99",
    "description": "Soczysty kotlet warzywny w bułce pełnoziarnistej z sałatą, pomidorem i pikantnym sosem.",
    "image": "images/vege-burger.jpg"
  },
  {
    "id": "m6",
    "name": "Kanapka z grillowanym kurczakiem",
    "price": "27.99",
    "description": "Delikatna pierś z kurczaka z awokado, bekonem, sałatą i miodowo-musztardowym sosem na tostowanej bułce.",
    "image": "images/chicken-sandwich.jpg"
  },
  {
    "id": "m7",
    "name": "Stek z frytkami",
    "price": "32.99",
    "description": "Soczysty stek wysmażony według preferencji, podawany z chrupiącymi złocistymi frytkami i masłem z ziołami.",
    "image": "images/steak-fries.jpg"
  },
  {
    "id": "m8",
    "name": "Zestaw sushi rolls",
    "price": "24.99",
    "description": "Zestaw świeżych rolek sushi, w tym California, pikantny tuńczyk oraz węgorz z awokado.",
    "image": "images/sushi.jpg"
  },
  {
    "id": "m9",
    "name": "Kurczak w curry",
    "price": "23.99",
    "description": "Delikatne kawałki kurczaka duszone w bogatym i aromatycznym sosie curry, podawane z ryżem basmati.",
    "image": "images/curry.jpg"
  },
  {
    "id": "m10",
    "name": "Wegańska miska Buddy",
    "price": "27.99",
    "description": "Pożywna miska z quinoa, pieczonymi warzywami, awokado i sosem tahini.",
    "image": "images/bowl.jpg"
  },
  {
    "id": "m11",
    "name": "Paella z owocami morza",
    "price": "39.99",
    "description": "Hiszpańska klasyka z ryżem szafranowym, krewetkami, małżami i chorizo.",
    "image": "images/paella.jpg"
  },
  {
    "id": "m12",
    "name": "Stos naleśników",
    "price": "22.99",
    "description": "Puszyste naleśniki ułożone w wysoki stos, polane syropem klonowym i udekorowane świeżymi owocami.",
    "image": "images/pancake.jpg"
  },
  {
    "id": "m13",
    "name": "Ramen Miso",
    "price": "34.99",
    "description": "Rozgrzewająca zupa ramen na bazie bulionu miso, z delikatną wieprzowiną, jajkiem na miękko i zieloną cebulką.",
    "image": "images/ramen.jpg"
  },
  {
    "id": "m14",
    "name": "Tacos z wołowiną",
    "price": "30.99",
    "description": "Trzy miękkie tortille wypełnione doprawioną wołowiną, świeżą salsą, serem i śmietaną.",
    "image": "images/tacos.jpg"
  },
  {
    "id": "m15",
    "name": "Czekoladowe brownie",
    "price": "15.99",
    "description": "Gęste i wilgotne brownie, podane z kulką lodów waniliowych oraz sosem czekoladowym.",
    "image": "images/brownie.jpg"
  },
  {
    "id": "m16",
    "name": "Bisque z homara",
    "price": "14.99",
    "description": "Kremowa zupa na bazie wywaru z homara, aromatycznych warzyw i odrobiny brandy.",
    "image": "images/lobster-soup.jpg"
  },
  {
    "id": "m17",
    "name": "Risotto z grzybami",
    "price": "24.99",
    "description": "Kremowe risotto z ryżu Arborio z mieszanką dzikich grzybów, wykończone parmezanem.",
    "image": "images/risotto.jpg"
  },
  {
    "id": "m18",
    "name": "Parmigiana z bakłażana",
    "price": "23.99",
    "description": "Warstwy panierowanego bakłażana, sosu marinara oraz roztopionych serów mozzarella i parmezan.",
    "image": "images/eggplant.jpg"
  },
  {
    "id": "m19",
    "name": "Sernik cytrynowy",
    "price": "11.99",
    "description": "Kremowy sernik o intensywnym smaku cytryny, na kruchym spodzie z herbatników.",
    "image": "images/lemon-cheesecake.jpg"
  },
  {
    "id": "m20",
    "name": "Wrap z falafelem",
    "price": "18.99",
    "description": "Chrupiące falafele zawinięte w ciepłą pitę z sałatą, pomidorami i sosem tahini.",
    "image": "images/falafel.jpg"
  }
];

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db('foodApp');
    console.log('Połączono z MongoDB');
    await initializeCollections();
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

async function initializeCollections() {
  try {
    const db = getDB();
    const mealsCollection = db.collection('meals');
    const mealsCount = await mealsCollection.countDocuments();
    
    if (mealsCount === 0) {
      await mealsCollection.insertMany(sampleMeals);
      console.log('Dodano przykładowe dania do bazy danych');
    }
  } catch (error) {
    console.error('Błąd inicjalizacji kolekcji:', error);
  }
}