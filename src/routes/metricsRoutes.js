import express from "express";
import { getConvulsoesPorCachorro } from "../controllers/metricsController.js";

const router = express.Router();

router.get("/convulsoes", getConvulsoesPorCachorro);

export default router;
