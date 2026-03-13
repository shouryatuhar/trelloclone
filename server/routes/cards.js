import { Router } from "express";
import { createCard, updateCard, deleteCard } from "../controllers/cardsController.js";

const router = Router();

router.post("/", createCard);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);

export default router;
