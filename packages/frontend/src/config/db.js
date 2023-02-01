import url from "url";
import { MongoClient } from "mongodb";

module.exports = new (class DB {
  constructor() {
    this.uri = process.env.MONGODB_URI;
  }

  async getDB() {
    if (this.db) {
      return this.db;
    }
    const client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = await client.db(url.parse(this.uri).pathname.substr(1));
    this.db = db;
    return db;
  }
})();
