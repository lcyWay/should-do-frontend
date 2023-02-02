import { ObjectId } from "mongodb";

import mongo from "../../config/db";
import { makeActivity } from "../../config/back-util";

module.exports = async (req, res) => {
  const { id } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");

  let user = null;
  try {
    user = await collection.findOne({ _id: ObjectId(id) });
  } catch (error) {
    res.json({ message_code: "003" });
  }

  if (!user) return res.json({ message_code: "003" });
  if (user.isActivated) return res.json({ message_code: "001" });

  makeActivity({ code: "001" }, user);
  collection
    .updateOne(
      { name: user.name },
      {
        $set: {
          isActivated: true,
          activity: user.activity,
        },
      }
    )
    .then(
      () => res.json({ message_code: "002", success: true }),
      () => res.json({ message_code: "004" })
    );
};
