import mongo from "../../../config/db";
import { ObjectId } from "mongodb";
import { makeActivity } from "../../../config/back-util";

module.exports = async (req, res) => {
  const { name, title } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  user.dailyTasks.push({
    _id: new ObjectId(),
    title,
    createdAt: new Date(),
    isComplete: false,
    lastCompleteDate: new Date(),
  });
  makeActivity({ code: "007" }, user);

  collection
    .updateOne(
      { name },
      { $set: { dailyTasks: user.dailyTasks, activity: user.activity } }
    )
    .then(
      () => res.status(200).json(user.dailyTasks),
      (err) => res.status(400).json(err)
    );
};
