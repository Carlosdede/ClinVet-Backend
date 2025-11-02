import express from "express";
import { listarBaias, criarBaia } from "../controllers/baiaController.js";

const router = express.Router();

router.get("/", listarBaias);
router.post("/", criarBaia);

export default router;
