const mongo = require('../../../config/db');
import { protectUser } from '../../../config/back-util'

module.exports = async (req, res) => {
  const { name, _id } = req.body;
  const db = await mongo.getDB()
  const collection = await db.collection('users')
  const user = await collection.findOne({ name });

  const index = user.dailyTasks.findIndex(e => e._id == _id);
  const taskComplete = user.dailyTasks[index].isComplete;
  taskComplete && user.todayCompleteTasks--
  user.dailyTasks.splice(index, 1);

  collection
    .updateOne({ name }, {
      $set: {
        dailyTasks: user.dailyTasks,
        todayCompleteTasks: user.todayCompleteTasks
      }
    })
    .then(
      r => res.status(200).json(protectUser(user, true)),
      err => res.status(400).json(err),
    );
}
