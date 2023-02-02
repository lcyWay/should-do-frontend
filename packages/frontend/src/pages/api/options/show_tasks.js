import mongo from "../../../config/db";

import { protectUser, makeActivity } from "../../../config/back-util";

module.exports = async (req, res) => {
  const { name } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  user.showTasks = !user.showTasks;
  makeActivity(user.showTasks ? { code: "0031" } : { code: "0032" }, user);

  collection
    .updateOne(
      { name },
      { $set: { showTasks: user.showTasks, activity: user.activity } }
    )
    .then(
      () => res.status(200).json(protectUser(user)),
      (err) => res.status(400).json(err)
    );
};
