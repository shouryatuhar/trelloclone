import { Router } from "express";
import { createList, deleteList } from "../controllers/listsController.js";

const router = Router();

router.post("/", createList);
router.delete("/:id", deleteList);

export default router;
