import express from "express";
import {
  listarCachorros,
  cadastrarCachorro,
  atualizarCachorro,
  deletarCachorro,
} from "../controllers/cachorroController.js";

const router = express.Router();

router.get("/", listarCachorros);
router.post("/", cadastrarCachorro);
router.put("/:id_cachorro", atualizarCachorro);
router.delete("/:id_cachorro", deletarCachorro);

export default router;
