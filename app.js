/**
 * @file app.js
 * @description Backend API aplikacji do zamawiania jedzenia
 */

import bodyParser from "body-parser";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB, getDB } from "./db.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import path from "path";
import Stripe from "stripe";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15 ",
});

const file = fs.readFileSync("./openapi.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/images", express.static("public/images"));

app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return cb(new Error("Dozwolone formaty to .jpg, .jpeg, .png, .webp"));
    }
    cb(null, true);
  },
});

/**
 * Middleware do uwierzytelniania użytkownika za pomocą tokenu JWT.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {Function} next
 */

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Brak tokenu uwierzytelniającego" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = getDB();
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.id),
    });

    if (!user) {
      return res.status(401).json({ message: "Użytkownik nie istnieje" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(401)
      .json({ message: "Nieprawidłowy token", details: error.message });
  }
};

/**
 * @route GET /api/meals
 * @returns {Array<Object>} Lista dostępnych dań
 */

app.get("/api/meals", async (req, res) => {
  try {
    const db = getDB();
    const meals = await db
      .collection("meals")
      .find({})
      .sort({ name: 1 })
      .toArray();

    const result = meals.map((meal) => ({
      ...meal,
      image: `${req.protocol}://${req.get("host")}/images/${meal.image}`,
    }));

    res.json(result);
  } catch (error) {
    console.error("GET /api/meals error:", error);
    res.status(500).json({ message: "Błąd serwera", error: error.message });
  }
});

app.post(
  "/api/admin/meals/:id/image",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const db = getDB();
      const mealId = new ObjectId(req.params.id);
      const filename = req.file.filename;

      const meal = await db.collection("meals").findOne({ _id: mealId });

      if (meal?.image) {
        const oldPath = path.join("public/images", meal.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      await db
        .collection("meals")
        .updateOne({ _id: mealId }, { $set: { image: filename } });

      res.json({ success: true, filename });
    } catch (error) {
      console.error("Upload image error:", error);
      res
        .status(500)
        .json({ message: "Błąd przesyłania zdjęcia", error: error.message });
    }
  }
);

/**
 * @route POST /api/register
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Wszystkie pola są wymagane" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Nieprawidłowy format email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Hasło musi mieć minimum 6 znaków" });
    }

    const db = getDB();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Użytkownik już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    const token = jwt.sign(
      { email: newUser.email, id: result.insertedId },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      success: true,
      message: "Użytkownik zarejestrowany",
      token,
      user: {
        id: result.insertedId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Błąd rejestracji",
      error: error.message,
    });
  }
});

/**
 * @route POST /api/login
 * @param {string} email
 * @param {string} password
 */

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email i hasło są wymagane" });
    }

    const db = getDB();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Nieprawidłowe hasło" });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Logowanie udane",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Błąd logowania",
      error: error.message,
    });
  }
});

/**
 * @route POST /api/orders
 * @security bearerAuth
 */

app.post("/api/orders", authenticate, async (req, res) => {
  try {
    const orderData = req.body.order;
    const userId = req.user._id;

    if (!orderData?.items?.length) {
      return res.status(400).json({ message: "Brak pozycji w zamówieniu" });
    }

    const requiredFields = ["email", "name", "street", "postalCode", "city"];
    const missingFields = requiredFields.filter(
      (field) => !orderData.customer?.[field]?.trim()
    );

    if (missingFields.length) {
      return res
        .status(400)
        .json({ message: `Brak wymaganych pól: ${missingFields.join(", ")}` });
    }

    if (!orderData.customer.email.includes("@")) {
      return res.status(400).json({ message: "Nieprawidłowy email" });
    }

    const db = getDB();
    const newOrder = {
      ...orderData,
      userId: req.user._id,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await getDB().collection("orders").insertOne(newOrder);

    res.status(201).json({
      success: true,
      message: "Zamówienie utworzone!",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Błąd zapisu zamówienia",
      error: error.message,
    });
  }
});

/**
 * @route GET /api/orders
 * @security bearerAuth
 */

app.get("/api/orders", authenticate, async (req, res) => {
  try {
    const db = getDB();
    const orders = await db
      .collection("orders")
      .find(req.user.role === "admin" ? {} : { userId: req.user._id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Błąd pobierania zamówień",
      error: error.message,
    });
  }
});

/**
 * @route PUT /api/orders/:id/status
 * @param {string} id
 * @security bearerAuth
 */

app.put("/api/orders/:id/status", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Brak uprawnień do zmiany statusu" });
    }

    const db = getDB();
    const orderId = new ObjectId(req.params.id);
    const { status } = req.body;

    if (
      !["pending", "in progress", "completed", "cancelled"].includes(status)
    ) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowy status zamówienia" });
    }

    const result = await db
      .collection("orders")
      .updateOne({ _id: orderId }, { $set: { status, updatedAt: new Date() } });

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono zamówienia do aktualizacji" });
    }

    res.json({ success: true, message: "Status zaktualizowany" });
  } catch (error) {
    console.error("Update order status error:", error);
    res
      .status(500)
      .json({ message: "Błąd aktualizacji statusu", error: error.message });
  }
});

/**
 * @route POST /api/payment
 * @security bearerAuth
 */

app.post("/api/payment", authenticate, async (req, res) => {
  const { items, currency = "pln", metadata = {} } = req.body;

  const amount = items.reduce(
    (sum, i) => sum + i.quantity * Math.round(i.price * 100),
    0
  );

  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId: req.user._id.toString(),
        email: req.user.email,
        ...metadata,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ message: "Błąd inicjowania płatności" });
  }
});

/**
 * Middleware autoryzujący administratora
 */
function authorizeAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Brak dostępu (tylko administrator)" });
  }
  next();
}

/**
 * @route GET /api/admin/meals
 * @desc Zwraca listę wszystkich dań (tylko admin)
 */
app.get("/api/admin/meals", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const meals = await getDB()
      .collection("meals")
      .find()
      .sort({ name: 1 })
      .toArray();
    res.json(meals); 
  } catch (error) {
    console.error("GET /api/admin/meals error:", error);
    res
      .status(500)
      .json({ message: "Błąd pobierania dań", error: error.message });
  }
});

/**
 * @route POST /api/admin/meals
 * @desc Dodaje nowe danie (tylko admin)
 */
app.post("/api/admin/meals", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    if (!name || !price || !description || !image) {
      return res.status(400).json({ message: "Wszystkie pola są wymagane." });
    }

    const newMeal = {
      name,
      price: parseFloat(price),
      description,
      image,
      createdAt: new Date(),
    };

    const result = await getDB().collection("meals").insertOne(newMeal);
    res.status(201).json({ id: result.insertedId, ...newMeal });
  } catch (error) {
    console.error("POST /api/admin/meals error:", error);
    res
      .status(500)
      .json({ message: "Błąd dodawania dania", error: error.message });
  }
});

/**
 * @route DELETE /api/admin/meals/:id
 * @desc Usuwa danie po ID (tylko admin)
 */
app.delete(
  "/api/admin/meals/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getDB()
        .collection("meals")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Nie znaleziono dania." });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("DELETE /api/admin/meals/:id error:", error);
      res
        .status(500)
        .json({ message: "Błąd usuwania dania", error: error.message });
    }
  }
);

/**
 * @route PUT /api/admin/meals/:id
 * @desc Edytuje dane posiłku (tylko admin)
 */
app.put(
  "/api/admin/meals/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, description, image } = req.body;

      if (!name || !price || !description || !image) {
        return res.status(400).json({ message: "Wszystkie pola są wymagane." });
      }

      const updatedMeal = {
        name,
        price: parseFloat(price),
        description,
        image,
        updatedAt: new Date(),
      };

      const result = await getDB()
        .collection("meals")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedMeal });

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ message: "Nie znaleziono dania do edycji." });
      }

      res.json({ success: true, message: "Danie zaktualizowane." });
    } catch (error) {
      console.error("PUT /api/admin/meals/:id error:", error);
      res
        .status(500)
        .json({ message: "Błąd edytowania dania", error: error.message });
    }
  }
);

/**
 * @route POST /api/admin/meals/:id/image
 * @desc Przesyła nowe zdjęcie do posiłku
 */
app.post(
  "/api/admin/meals/:id/image",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const db = getDB();
      const mealId = new ObjectId(req.params.id);
      const filename = req.file.filename;

      await db
        .collection("meals")
        .updateOne({ _id: mealId }, { $set: { image: filename } });

      res.json({ success: true, filename });
    } catch (error) {
      console.error("Upload image error:", error);
      res
        .status(500)
        .json({ message: "Błąd przesyłania zdjęcia", error: error.message });
    }
  }
);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Wewnętrzny błąd serwera",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Serwer działa na porcie ${port}`);
      console.log(`Środowisko: ${process.env.NODE_ENV || "development"}`);
      console.log("Endpointy API:");
      console.log(`GET  http://localhost:${port}/api/meals`);
      console.log(`POST http://localhost:${port}/api/register`);
      console.log(`POST http://localhost:${port}/api/login`);
      console.log(`POST http://localhost:${port}/api/orders`);
      console.log(`GET  http://localhost:${port}/api/orders`);
    });
  })
  .catch((err) => {
    console.error("Błąd podczas uruchamiania serwera:", err);
    process.exit(1);
  });