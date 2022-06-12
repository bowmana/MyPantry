import "dotenv/config";
import { default as mongodb } from "mongodb";
const MongoClient = mongodb.MongoClient;

export class RowEntryDatabase {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    this.client = await MongoClient.connect(this.dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerAPIVersion.v1,
    });

    this.db = this.client.db("MyPantry");
    console.log("Connected to MongoDB");
    await this.init();
  }

  async init() {
    // this.collection = await this.db.createCollection('entries');
    // console.log('Created collection');
    this.collection = await this.db.collection("MyPantryEntries");
    console.log("entries collection");
  }

  async close() {
    await this.client.close();
    console.log("Disconnected from MongoDB");
  }

  async createRowEntry(item_name, quantity, unit) {
    const entry = {
      item_name,
      quantity,
      units: unit,
    };
    await this.collection.insertOne(entry);
    return entry;
  }
}
