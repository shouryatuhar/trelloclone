import { Router } from "express";
import { getBoards, createBoard } from "../controllers/boardsController.js";

const router = Router();

router.get("/", getBoards);
router.post("/", createBoard);

export default router;
