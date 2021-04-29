const mongo = require('../../config/db');
const ObjectId = require('mongodb').ObjectID;
import { makeActivity } from '../../config/back-util';

module.exports = async (req, res) => {
  const { id } = req.body;
  const db = await mongo.getDB()
  const collection = await db.collection('users')
  const user = await collection.findOne({ _id: ObjectId(id) });

  if (user) {
    if (user.isActivated) {
      res.status(201).json({ message: 'User is already activated' })
    } else {
      makeActivity(`${user.name} registered successfully. Welcome!`, user);
      collection
        .updateOne({ name: user.name }, {
          $set: {
            isActivated: true,
            activity: user.activity
          }
        })
        .then(
          r => res.status(200).json({ message: 'User activated successfully' }),
          err => res.status(500).json({ message: 'Error with database' }),
        );
    }
  } else {
    res.status(400).json({ message: 'Wrong activation url!' })
  }
}
