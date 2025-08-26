import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { errorHandler, logger } from "../middlewares";
import router from "../routes";
import morgan from "morgan";
import initDbConnection from "../db";
import { initSentenceTransformers } from "../pkg/SentenceTransformers";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.listen(5555, async () => {
  const st = await initSentenceTransformers();
  console.log("Sentence Transformers loaded", st);
  app.use(router);
  await initDbConnection(process.env.DB_DEV as string);
  app.use(errorHandler);
  logger.info(`🚀 Server running on http://localhost:5555`);
});
