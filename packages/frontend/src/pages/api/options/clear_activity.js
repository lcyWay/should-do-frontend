import mongo from "../../../config/db";

import { protectUser } from "../../../config/back-util";

module.exports = async (req, res) => {
  const { name } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  user.activity = [];

  collection.updateOne({ name }, { $set: { activity: [] } }).then(
    () => res.status(200).json(protectUser(user)),
    (err) => res.status(400).json(err)
  );
};
