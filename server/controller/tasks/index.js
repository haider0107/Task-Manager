import express from "express";
import taskModel from "../../models/Tasks/index.js";
import authMiddleware from "../../middleware/auth/verifytoken.js";
import {
  taskCreationValidationRules,
  errorMiddleware,
  taskEditValidationRules,
} from "../../middleware/validations/index.js";
import sendMailer from "../../utils/sendMail.js";
import { agenda, startAgenda } from "../../utils/agenda.js";

startAgenda();

const router = express.Router();

// Creating a todo ....
router.post(
  "/",
  authMiddleware,
  taskCreationValidationRules(),
  errorMiddleware,
  async (req, res) => {
    try {
      const payload = req.payload;

      let { taskName, deadline } = req.body;

      let reminders = setReminder(deadline);

      if (reminders.error) {
        return res.status(400).json({ error: reminders.error });
      }

      let tasks = await taskModel
        .findOne({ user: payload._id })
        .populate("user", "fname");

      reminders = await scheduleJobs(
        reminders,
        tasks.user.fname,
        req.payload.email,
        taskName
      );

      let taskData = {
        taskName,
        deadline,
        reminders,
      };

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

/*
 subject: "This is a  Reminder",
                    to: email,
                    body: `Hi Saad, 
                    This is a Reminder - ${i + 1} to Complete your Task ${task_name}`
*/

agenda.define("sendReminder", async (job) => {
  // sendMailer({
  //   to: job.attrs.data.email,
  //   subject: "Reminder",
  //   text: `Hi,${job.attrs.data.fname}\nthis is your number ${job.attrs.data.i} reminder`,
  // });
  console.log(job.attrs.data);
  job.remove();
});

// set reminders array
function setReminder(deadline, res) {
  let presentTime = new Date();

  let deadlineUTC = new Date(deadline);

  let reminders = [];
  if (presentTime > deadlineUTC) {
    return { error: "Deadline is in the past" };
  }

  let difference = deadlineUTC - presentTime;

  let mins = difference / (1000 * 60);

  let days = difference / (1000 * 60 * 60 * 24);

  if (mins < 5 || days > 30) {
    return {
      error:
        "Invalid date entered, deadline should be more than 5 minutes and less than 30 days",
    };
  }

  let reminder1 = new Date(+presentTime + difference / 4);
  let reminder2 = new Date(+presentTime + difference / 2);
  let reminder3 = new Date(+presentTime + difference / (4 / 3));

  reminders.push(
    { jobTime: reminder1 },
    { jobTime: reminder2 },
    { jobTime: reminder3 },
    { jobTime: deadlineUTC }
  );

  return reminders;
}

// job scheduler function
async function scheduleJobs(reminders, fname, email, taskName) {
  try {
    let finalArray = [];
    let i = 0;
    while (i < reminders.length) {
      let job = await agenda.schedule(reminders[i].jobTime, "sendReminder", {
        reminder: true,
        dateTime: reminders[i].jobTime,
        i,
        email: email,
        fname: fname,
        taskName: taskName,
      });
      finalArray.push({ jobTime: reminders[i].jobTime, jobId: job.attrs._id });
      i++;
    }
    return finalArray;
  } catch (error) {
    console.log(error);
  }
}

// delete an agenda
router.post("/delete/:agendaId", authMiddleware, async (req, res) => {
  try {
    const { agendaId } = req.params;
    let agendaList = await agenda.jobs({ name: "sendReminder" });
    agendaList.forEach((ele, i) => {
      let job = ele;
      if (agendaId == job.attrs._id) {
        job.remove();
      }
    });
    const removed = await agenda.cancel({ _id: agendaId });

    console.log(removed);

    res.status(200).json({ success: "Agenda Cancelled Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { _id } = req.payload;

    let tasks = await taskModel.find({ user: _id }, "tasks");

    tasks = tasks[0].tasks;

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Get a perticular task
router.get("/:task_id", authMiddleware, async (req, res) => {
  try {
    const { task_id } = req.params;
    const { _id } = req.payload;

    let tasks = await taskModel.find({ user: _id }, "tasks");

    tasks = tasks[0].tasks.filter((ele) => ele._id == task_id);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Delete a specific task

router.delete("/:task_id", authMiddleware, async (req, res) => {
  try {
    const { task_id } = req.params;
    const { _id } = req.payload;

    const remove = await taskModel.updateOne(
      { user: _id },
      {
        $pull: { tasks: { _id: task_id } },
      },
      {
        safe: true,
      }
    );

    res.status(200).json({ remove });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Edit a task

router.put(
  "/:task_id",
  authMiddleware,
  taskEditValidationRules(),
  errorMiddleware,
  async (req, res) => {
    try {
      const { task_id } = req.params;
      const { _id } = req.payload;

      // To update a task
      if (req.body.taskName) {
        let task = await taskModel.findOneAndUpdate(
          {
            user: _id,
            "tasks._id": task_id,
          },
          {
            $set: {
              "tasks.$.taskName": req.body.taskName, // Use the positional operator ($) to update the name field
            },
          },
          {
            new: true,
          }
        );
      }

      // Update a deadline
      if (req.body.deadline) {
        let reminders = setReminder(req.body.deadline);

        if (reminders.error) {
          return res.status(400).json({ error: reminders.error });
        }

        // Deleting agenda i.e. reminders schedulers
        let tasks = await taskModel
          .find({ user: _id }, "tasks")
          .populate("user", "fname");

        let fname = tasks[0].user.fname;

        tasks = tasks[0].tasks.filter((ele) => ele._id == task_id);

        let rems = tasks[0].reminders;

        for (let rem of rems) {
          let deadlineUTC = new Date(rem.jobTime);
          let presentTime = new Date();
          if (presentTime < deadlineUTC) {
            const agendaId = rem.jobId;
            let agendaList = await agenda.jobs({ name: "sendReminder" });
            agendaList.forEach((ele) => {
              let job = ele;
              if (agendaId == job.attrs._id) {
                job.remove();
              }
            });
            const removed = await agenda.cancel({ _id: agendaId });

            console.log(removed);
          }
        }

        reminders = await scheduleJobs(
          reminders,
          fname,
          req.payload.email,
          tasks.taskName
        );

        console.log(reminders);

        let task = await taskModel.findOneAndUpdate(
          {
            user: _id,
            "tasks._id": task_id,
          },
          {
            $set: {
              "tasks.$.reminders": reminders, // Use the positional operator ($) to update the name field
            },
          },
          {
            new: true,
          }
        );
      }
      res.status(200).json({ success: "Task edited successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

export default router;
