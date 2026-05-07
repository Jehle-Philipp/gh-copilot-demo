import cors from "cors";
import express from "express";
import albumsRouter from "./routes/albums";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/albums", albumsRouter);

export default app;
