import express from "express";
import dotenv from "dotenv";
import walletRoutes from "./routes/walletRoutes.js";
import timelockRoutes from "./routes/timelockRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("0xedohwarez Server is Running 🚀");
});

app.use("/api/wallet", walletRoutes);
app.use("/api/timelock", timelockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
