// import express from "express";
// import cors from "cors";

// import dotenv from "dotenv";
// import prisma from "./src/config/prismaClient.js";
// import userRoutes from "./src/routes/user.routes.js";
// import categoryRoutes from "./src/routes/category.routes.js";

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.set("json spaces", 2);
// app.use(cors());

// app.use("/api/users", userRoutes);
// app.use("/api/categories", categoryRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// async function testDB() {
//   try {
//     await prisma.$connect();
//     console.log("DB connected successfully");
//   } catch (error) {
//     console.error(" DB connection failed:", error);
//   }
// }

// testDB();












import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import prisma from "./src/config/prismaClient.js";
import userRoutes from "./src/routes/user.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.set("json spaces", 2);

// CORS configuration - specific origin with credentials
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

// Preflight fix - express v4.20+ compatible
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function testDB() {
  try {
    await prisma.$connect();
    console.log("DB connected successfully");
  } catch (error) {
    console.error(" DB connection failed:", error);
  }
}

testDB();