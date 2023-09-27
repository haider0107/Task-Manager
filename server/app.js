import express from "express";
import "./dbConnect.js";
import config from "config";
import userRouter from "./controller/users/index.js";
import taskRouter from "./controller/tasks/index.js";

const app = express(); // Instantition

const port = config.get("PORT");

app.use(express.json()); // Body Parser

app.get("/", (req, res) => {
  res.status(200).json({ success: "Hello there" });
});

// User Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
