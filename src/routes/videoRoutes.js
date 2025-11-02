// routes/eventoRoutes.js
import express from "express";
import { createClip, listClips } from "../controllers/eventoController.js";

const router = express.Router();

router.post("/clips", createClip);
router.get("/clips", listClips);

export default router;
