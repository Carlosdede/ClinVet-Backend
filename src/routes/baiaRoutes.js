import express from "express";
import {
  listarBaias,
  criarBaia,
  atualizarBaia,
  deletarBaia,
} from "../controllers/baiaController.js";

const router = express.Router();

router.get("/", listarBaias);
router.post("/", criarBaia);
router.put("/:id_baia", atualizarBaia);
router.delete("/:id_baia", deletarBaia);

export default router;
