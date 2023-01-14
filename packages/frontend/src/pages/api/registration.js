const mongo = require('../../config/db');
const ObjectId = require('mongodb').ObjectID;

import { api_back } from '../../api'
import { sendEmail } from '../../config/back-util'

module.exports = async (req, res) => {
  const { email, name, password } = req.body;
  const db = await mongo.getDB()
  const collection = await db.collection('users')

  collection.find({}).limit(0).toArray((err, users) => {
    let isUsedName = false;
    let isUsedEmail = false;
    users.forEach(e => {
      if (e.name === name) {
        isUsedName = true;
      }
      if (e.email === email) {
        isUsedEmail = true;
      }
    })

    if (isUsedName) {
      res.status(400).json({ code_message: '001' })
    } else if (isUsedEmail) {
      res.status(400).json({ code_message: '002' })
    } else {
      const newUser = {
        _id: ObjectId(),
        name,
        email,
        password,
        createdAt: new Date(),
        imageUrl: null,
        showTasks: true,
        online: new Date(),
        isActivated: false,
        activity: [],
        tasks: [],
        dailyTasks: [],
        graphData: {},
        todayCompleteTasks: 0,
        daysInRow: 0,
        daysInRowDate: 'Mon Apr 19 2019 13:56:17 GMT+0300 (Москва, стандартное время)',
        lastCompleteDate: 'Mon Apr 19 2019 13:56:17 GMT+0300 (Москва, стандартное время)'
      }
      collection
        .insertOne(newUser)
        .then(
          async (r) => {
            const email_data = await api_back('send_email', { email, name, link: `https://what-should-i-do.vercel.app/profile/activate/${newUser._id}` });
            res.status(200).json({ code_message: '003', email_data })
          });
    }
  })
}
