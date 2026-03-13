import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import boardsRouter from "./routes/boards.js";
import listsRouter from "./routes/lists.js";
import cardsRouter from "./routes/cards.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/boards", boardsRouter);
app.use("/lists", listsRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
