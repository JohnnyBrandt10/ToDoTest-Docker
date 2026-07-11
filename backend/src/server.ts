import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/tasks", tasksRouter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(4000, () => console.log("API running on port 4000"));