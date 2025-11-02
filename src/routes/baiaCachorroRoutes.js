import express from "express";
import {
  vincularCachorro,
  listarCachorrosPorBaia,
} from "../controllers/baiaCachorroController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, vincularCachorro);
router.get("/:id_baia", verifyToken, listarCachorrosPorBaia);

export default router;
