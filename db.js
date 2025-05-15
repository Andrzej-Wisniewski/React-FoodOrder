import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Brak zmiennej środowiskowej MONGODB_URI w pliku .env");
}

const client = new MongoClient(uri);
let db;

const sampleMeals = [
  {
    name: "Makaron z serem",
    price: 28.99,
    description:
      "Kremowy ser cheddar wymieszany z doskonale ugotowanym makaronem, posypany chrupiącą bułką tartą. Klasyczne danie na pocieszenie.",
    image: "mac-and-cheese.jpg",
  },
  {
    name: "Pizza Margherita",
    price: 24.99,
    description:
      "Klasyczna pizza z świeżą mozzarellą, pomidorami i bazylią na cienkim, chrupiącym cieście.",
    image: "margherita-pizza.jpg",
  },
  {
    name: "Sałatka Cezar",
    price: 24.99,
    description:
      "Sałata rzymska w sosie Cezar, posypana grzankami i wiórkami parmezanu.",
    image: "caesar-salad.jpg",
  },
  {
    name: "Spaghetti Carbonara",
    price: 29.99,
    description:
      "Makaron spaghetti al dente z kremowym sosem z żółtek jaj, sera pecorino, pancetty i pieprzu.",
    image: "spaghetti-carbonara.jpg",
  },
  {
    name: "Stek z frytkami",
    price: 32.99,
    description:
      "Soczysty stek wysmażony według preferencji, podawany z chrupiącymi złocistymi frytkami i masłem z ziołami.",
    image: "steak-fries.jpg",
  },
  {
    name: "Zestaw sushi rolls",
    price: 24.99,
    description:
      "Zestaw świeżych rolek sushi, w tym California, pikantny tuńczyk oraz węgorz z awokado.",
    image: "sushi.jpg",
  },
  {
    name: "Kurczak w curry",
    price: 23.99,
    description:
      "Delikatne kawałki kurczaka duszone w bogatym i aromatycznym sosie curry, podawane z ryżem basmati.",
    image: "curry.jpg",
  },
  {
    name: "Naleśniki",
    price: 22.99,
    description:
      "Puszyste naleśniki ułożone w wysoki stos, polane syropem klonowym i udekorowane świeżymi owocami.",
    image: "pancakes.jpg",
  },
  {
    name: "Ramen Miso",
    price: 34.99,
    description:
      "Rozgrzewająca zupa ramen na bazie bulionu miso, z delikatną wieprzowiną, jajkiem na miękko i zieloną cebulką.",
    image: "ramen.jpg",
  },
  {
    name: "Tacos z wołowiną",
    price: 30.99,
    description:
      "Trzy miękkie tortille wypełnione doprawioną wołowiną, świeżą salsą, serem i śmietaną.",
    image: "tacos.jpg",
  },
  {
    name: "Czekoladowe brownie",
    price: 15.99,
    description:
      "Gęste i wilgotne brownie, podane z kulką lodów waniliowych oraz sosem czekoladowym.",
    image: "brownie.jpg",
  },
  {
    name: "Risotto z grzybami",
    price: 24.99,
    description:
      "Kremowe risotto z ryżu Arborio z mieszanką dzikich grzybów, wykończone parmezanem.",
    image: "risotto.jpg",
  },
  {
    name: "Sernik cytrynowy",
    price: 11.99,
    description:
      "Kremowy sernik o intensywnym smaku cytryny, na kruchym spodzie z herbatników.",
    image: "lemon-cheesecake.jpg",
  },
];

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db();
    console.log("Połączono z MongoDB");
    await initializeCollections();
  } catch (error) {
    console.error("Błąd połączenia z MongoDB:", error.message);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("Baza danych nie jest jeszcze połączona!");
  }
  return db;
};

async function initializeCollections() {
  try {
    const db = getDB();
    const mealsCollection = db.collection("meals");
    const mealsCount = await mealsCollection.countDocuments();

    if (mealsCount === 0) {
      await mealsCollection.insertMany(sampleMeals);
      console.log("Dodano przykładowe dania do bazy danych");
    }
  } catch (error) {
    console.error("Błąd inicjalizacji kolekcji:", error);
  }
}
