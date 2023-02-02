import mongo from "../../../config/db";

module.exports = async (req, res) => {
  const { name, _id } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  const index = user.tasks.findIndex((e) => e._id == _id);
  user.tasks.splice(index, 1);

  collection.updateOne({ name }, { $set: { tasks: user.tasks } }).then(
    () => res.status(200).json(user.tasks),
    (err) => res.status(400).json(err)
  );
};
