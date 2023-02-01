import mongo from "../../config/db";
import { checkGraphData, protectUser } from "../../config/back-util";

module.exports = async (req, res) => {
  const { name } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  checkGraphData(user);

  collection.updateOne({ name }, { $set: { graphData: user.graphData } }).then(
    () => res.json(protectUser(user, true)),
    (err) => res.status(400).json(err)
  );
};
