import express from "express";
import {
  listarCachorros,
  cadastrarCachorro,
} from "../controllers/cachorroController.js";

const router = express.Router();

router.get("/", listarCachorros);
router.post("/", cadastrarCachorro);

export default router;
