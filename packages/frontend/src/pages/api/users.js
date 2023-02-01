import mongo from "../../config/db";

module.exports = async (req, res) => {
  const db = await mongo.getDB();
  const collection = await db.collection("users");
  const { count } = req.body;

  collection
    .find({ isActivated: true })
    .project({ name: 1, imageUrl: 1, online: 1, _id: 0 })
    .limit(count)
    .toArray((err, r) => res.json({ users: r, ok: count < r.length }));
};
