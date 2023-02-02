import mongo from "../../../config/db";

module.exports = async (req, res) => {
  const { name, _id } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const user = await collection.findOne({ name });

  const index = user.dailyTasks.findIndex((e) => e._id == _id);
  const taskComplete = user.dailyTasks[index].isComplete;
  taskComplete && user.todayCompleteTasks--;
  user.dailyTasks.splice(index, 1);

  collection
    .updateOne(
      { name },
      {
        $set: {
          dailyTasks: user.dailyTasks,
          todayCompleteTasks: user.todayCompleteTasks,
        },
      }
    )
    .then(
      () => res.status(200).json(user.dailyTasks),
      (err) => res.status(400).json(err)
    );
};
