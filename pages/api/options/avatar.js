const mongo = require('../../../config/db');
import { makeActivity, protectUser } from '../../../config/back-util'

module.exports = async (req, res) => {
  const { name, imageUrl } = req.body;
  const db = await mongo.getDB()
  const collection = await db.collection('users')
  const user = await collection.findOne({ name });

  user.imageUrl = imageUrl;
  makeActivity(`${user.name} ${imageUrl === null ? 'deleted' : 'changed'} avatar`, user);

  collection
    .updateOne({ name }, { $set: { imageUrl, activity: user.activity } })
    .then(
      r => res.status(200).json(protectUser(user)),
      err => res.status(400).json(err),
    );
}
