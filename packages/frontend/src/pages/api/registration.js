import { ObjectId } from "mongodb";

import mongo from "../../config/db";

module.exports = async (req, res) => {
  const { email, name, password } = req.body;
  const db = await mongo.getDB();
  const collection = await db.collection("users");

  collection
    .find({})
    .limit(0)
    .toArray((err, users) => {
      let isUsedName = false;
      let isUsedEmail = false;
      users.forEach((e) => {
        if (e.name === name) {
          isUsedName = true;
        }
        if (e.email === email) {
          isUsedEmail = true;
        }
      });

      if (isUsedName) {
        res.status(400).json({ ok: false, code_message: "001" });
      } else if (isUsedEmail) {
        res.status(400).json({ ok: false, code_message: "002" });
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
          isActivated: true,
          activity: [{ createdAt: new Date(), title: { code: "001" } }],
          tasks: [],
          dailyTasks: [],
          graphData: {},
          todayCompleteTasks: 0,
          daysInRow: 0,
          daysInRowDate: "Mon Apr 19 2019 13:56:17 GMT+0300 (Москва, стандартное время)",
          lastCompleteDate: "Mon Apr 19 2019 13:56:17 GMT+0300 (Москва, стандартное время)",
        };
        collection.insertOne(newUser).then(() => {
          res.status(200).json({ ok: true, code_message: "003" });
        });
      }
    });
};
