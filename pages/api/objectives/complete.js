const mongo = require('../../../config/db');
import dayjs from 'dayjs'
import { makeActivity, getDays } from '../../../config/back-util'

module.exports = async (req, res) => {
  const { name, id } = req.body;
  const db = await mongo.getDB()
  const collection = await db.collection('users')
  const user = await collection.findOne({ name });

  const tasks = [...user.tasks];
  const task = tasks.find(e => e._id == id);
  task.isComplete = true;
  makeActivity(`${user.name} complete one objective`, user);

  const date = dayjs(new Date()).format('DD.MM');
  if (user.graphData[date]) {
    user.graphData[date]++
  } else {
    const days = getDays();
    const newGraphData = {};
    days.forEach(d => {
      newGraphData[d] = user.graphData[d] || 0;
    })
    newGraphData[date] = newGraphData[date] ? newGraphData[date]++ : 1;
    user.graphData = newGraphData;
  }

  collection
    .updateOne({ name }, { $set: { tasks, activity: user.activity, graphData: user.graphData } })
    .then(
      r => res.status(200).json(tasks),
      err => res.status(400).json(err),
    );
}
