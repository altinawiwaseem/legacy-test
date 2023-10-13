import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
/* import userRoutes from "./routes/user.js";*/
import stepsRoutes from "./routes/steps.js";
import userRoutes from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import configureJwtStrategy from "./passport-config.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

// specify your middleware here
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  express.json({
    extended: true,
    limit: "10mb",
  })
);

dotenv.config();
app.use(cookieParser());
app.use(passport.initialize());
configureJwtStrategy(passport);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 3001;

app.use("/user", userRoutes);
app.use("/api", stepsRoutes);
console.log("Connecting to database. Put the kettle on while you wait... 🫖");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}.${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Database connected! 😍☕"))
  .catch((error) => console.log(error, "Database did not connect! ☹️❌"));

// Serve frontend client/build folder
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "../client/build/index.html");
  fs.stat(indexPath, (err, stats) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error serving index.html");
    } else {
      res.sendFile(indexPath);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});

app.listen(port, () =>
  console.log(`The server is listening on port ${port} ... 🐒`)
);
