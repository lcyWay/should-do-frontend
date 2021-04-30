const mongo = require('../../config/db');
import { protectUser } from '../../config/back-util'

module.exports = async (req, res) => {
  const { email, password } = req.body;;
  const db = await mongo.getDB()
  const collection = await db.collection('users')
  const user = await collection.findOne({ email, password })

  if (user) {
    const userdata = { ...user, online: null }
    collection
      .updateOne({ name: user.name }, { $set: { online: null } })
      .then(
        r => res.status(200).json(protectUser(userdata))
      )
  } else {
    res.status(400).json({ message_code: '001' })
  }
}
