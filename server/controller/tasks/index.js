import express from "express";
import taskModel from "../../models/Tasks/index.js";
import authMiddleware from "../../middleware/auth/verifytoken.js";
import {
  taskCreationValidationRules,
  errorMiddleware,
} from "../../middleware/validations/index.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  taskCreationValidationRules(),
  errorMiddleware,
  async (req, res) => {
    try {
      const payload = req.payload;

      let { taskName, deadline } = req.body;

      let presentTime = new Date();

      let deadlineUTC = new Date(deadline);

      let reminders = [];
      if (presentTime > deadlineUTC) {
        return res.status(400).json({ error: "Deadline is in the past" });
      }

      let difference = deadlineUTC - presentTime;

      let mins = difference / (1000 * 60);

      let days = difference / (1000 * 60 * 60 * 24);

      if (mins < 5 || days > 30) {
        return res.status(400).json({
          error:
            "Invalid date entered, deadline should be more than 5 minutes and less than 30 days",
        });
      }

      let reminder1 = new Date(+presentTime - difference / 4);
      let reminder2 = new Date(+presentTime - difference / 2);
      let reminder3 = new Date(+presentTime - difference / (4 / 3));

      reminders.push(reminder1, reminder2, reminder3, deadlineUTC);

      let taskData = {
        taskName,
        deadline,
        reminders,
      };

      let tasks = await taskModel.findOne({ user: payload._id });
      tasks.tasks.push(taskData);

      await tasks.save();

      res
        .status(200)
        .json({ success: "New task created successfully..", tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

export default router;
