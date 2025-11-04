import express from "express";
import {
  vincularCachorro,
  listarCachorrosPorBaia,
  removerAssociacao,
} from "../controllers/baiaCachorroController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, vincularCachorro);
router.get("/:id_baia", verifyToken, listarCachorrosPorBaia);
router.delete("/:id_baia", removerAssociacao);

export default router;
