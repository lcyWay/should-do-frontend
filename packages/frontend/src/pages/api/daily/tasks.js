const mongo = require('../../../config/db');
import dayjs from 'dayjs'
import { protectUser } from '../../../config/back-util'

module.exports = async (req, res) => {
  const { name } = req.body;
  const db = await mongo.getDB()
  const collection = await db.collection('users')
  const user = await collection.findOne({ name });

  function setDailyTasks() {
    user.dailyTasks = user.dailyTasks.map(e => {
      return {
        ...e,
        isComplete: false
      }
    })
  }

  const date = dayjs(user.lastCompleteDate)
  const newDate = new Date();

  const d1 = date.format('DD');
  const d2 = dayjs(newDate).format('DD');

  if ((dayjs(newDate).diff(date, 'day') > 1) || (+d2 - +d1 == 2)) {
    user.todayCompleteTasks = 0;
    user.daysInRow = 0;
    setDailyTasks();
  } else if (+d1 != +d2) {
    user.todayCompleteTasks = 0;
    setDailyTasks();
  }

  collection
    .updateOne({ name }, {
      $set: {
        daysInRow: user.daysInRow,
        todayCompleteTasks: user.todayCompleteTasks,
        dailyTasks: user.dailyTasks
      }
    })
    .then(
      r => res.status(200).json(protectUser(user, true)),
      err => res.status(400).json(err),
    );
}
