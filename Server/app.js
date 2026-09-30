import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { corsOptions } from "./src/config/cors.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { notFound } from "./src/middlewares/notFound.js";
import apiRoutes from "./src/routes/index.js";
import { setupSwagger } from "./src/swagger.js";

const app = express();

// ── Core middlewares ──────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Swagger Documentation ─────────────────────────────────────────────────────
setupSwagger(app);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  res.send("success..");
});
// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
