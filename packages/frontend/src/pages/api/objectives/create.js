import mongo from "../../../config/db";
import { ObjectId } from "mongodb";
import { makeActivity } from "../../../config/back-util";

module.exports = async (req, res) => {
  const { name, title } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  user.tasks.push({
    _id: new ObjectId(),
    title,
    isComplete: false,
    createdAt: new Date(),
  });
  makeActivity({ code: "005" }, user);

  collection
    .updateOne(
      { name },
      { $set: { tasks: user.tasks, activity: user.activity } }
    )
    .then(
      () => res.status(200).json(user.tasks),
      (err) => res.status(400).json(err)
    );
};
