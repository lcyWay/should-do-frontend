import mongo from "../../../config/db";
import { makeActivity, protectUser } from "../../../config/back-util";

module.exports = async (req, res) => {
  const { name, imageUrl } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  user.imageUrl = imageUrl;
  makeActivity(imageUrl === null ? { code: "0021" } : { code: "0022" }, user);

  collection
    .updateOne({ name }, { $set: { imageUrl, activity: user.activity } })
    .then(
      () => res.status(200).json(protectUser(user)),
      (err) => res.status(400).json(err)
    );
};
