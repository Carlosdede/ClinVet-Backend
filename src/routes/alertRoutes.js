import express from "express";
import { createAlert, listAlerts } from "../controllers/alertsController.js";
const router = express.Router();
import { verifyToken } from "../middleware/authMiddleware.js";

router.post("/", createAlert);
router.get("/", verifyToken, listAlerts);

export default router;
