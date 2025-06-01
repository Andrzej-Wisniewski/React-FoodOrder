/**
 * @file db.js
 * @description Inicjalizacja połączenia z MongoDB i załadowanie przykładowych danych.
 */

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Brak zmiennej środowiskowej MONGODB_URI w pliku .env");
}

const client = new MongoClient(uri);
let db;

/**
 * Nawiązuje połączenie z MongoDB.
 * @returns {Promise<void>}
 */

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db();
    console.log("Połączono z MongoDB");
  } catch (error) {
    console.error("Błąd połączenia z MongoDB:", error.message);
    process.exit(1);
  }
};

/**
 * Zwraca instancję bazy danych.
 * @returns {import("mongodb").Db}
 */

export const getDB = () => {
  if (!db) {
    throw new Error("Baza danych nie jest jeszcze połączona!");
  }
  return db;
};
