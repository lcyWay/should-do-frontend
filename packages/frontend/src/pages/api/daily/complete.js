const mongo = require("../../../config/db");
import dayjs from "dayjs";
import { makeActivity, protectUser } from "../../../config/back-util";

module.exports = async (req, res) => {
  const { name, id } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  const date = new Date();

  const dailyTasks = [...user.dailyTasks];
  const task = dailyTasks.find((e) => e._id == id);
  task.isComplete = true;
  task.lastCompleteDate = date;

  user.dailyTasks = dailyTasks;
  user.lastCompleteDate = date;
  user.todayCompleteTasks++;

  const d1 = dayjs(user.daysInRowDate).format("DD");
  const d2 = dayjs(date).format("DD");

  if (user.todayCompleteTasks == user.dailyTasks.length && +d1 != +d2) {
    user.daysInRow++;
    user.daysInRowDate = date;
    makeActivity({ code: "006" }, user);
  }

  collection
    .updateOne(
      { name },
      {
        $set: {
          dailyTasks,
          lastCompleteDate: user.lastCompleteDate,
          todayCompleteTasks: user.todayCompleteTasks,
          daysInRow: user.daysInRow,
          daysInRowDate: user.daysInRowDate,
          activity: user.activity,
        },
      },
    )
    .then(
      (r) => res.status(200).json(dailyTasks),
      (err) => res.status(400).json(err),
    );
};
