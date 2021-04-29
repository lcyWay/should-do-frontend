const mongo = require('../../../config/db');
const ObjectId = require('mongodb').ObjectID
import { makeActivity, protectUser } from '../../../config/back-util'

module.exports = async (req, res) => {
  const { name, title } = req.body;
  const db = await mongo.getDB()
  const collection = await db.collection('users')
  const user = await collection.findOne({ name });

  user.dailyTasks.push({
    _id: new ObjectId(),
    title,
    createdAt: new Date(),
    isComplete: false,
    lastCompleteDate: new Date(),
  });
  makeActivity(`${user.name} created new daily task`, user);

  collection
    .updateOne({ name }, { $set: { dailyTasks: user.dailyTasks, activity: user.activity } })
    .then(
      r => res.status(200).json(protectUser(user, true)),
      err => res.status(400).json(err),
    );
}
