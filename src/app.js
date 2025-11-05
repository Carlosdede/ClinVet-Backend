import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import baiaCachorroRoutes from "./routes/baiaCachorroRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import cachorroRoutes from "./routes/cachorroRoutes.js";
import baiaRoutes from "./routes/baiaRoutes.js";
import eventoRoutes from "./routes/eventoRoutes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.get("/", (req, res) => {
  res.send("ClinVet Backend online");
});

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/alerts", alertRoutes);
app.use("/videos", videoRoutes);
app.use("/users", userRoutes);
app.use("/baia-cachorro", baiaCachorroRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/cachorros", cachorroRoutes);
app.use("/baias", baiaRoutes);
app.use("/eventos", eventoRoutes);

export default app;
