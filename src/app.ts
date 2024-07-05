import express from "express";
import searchRoutes from "./routes/searchRoutes";

const app = express();

app.use(express.json());
app.use("/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

export default app;
