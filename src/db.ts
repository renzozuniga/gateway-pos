import { MongoClient } from "mongodb";

const { MONGO_URI = 'mongodb+srv://dbToken:8t279xIt1met2Bk1@tokencluster.wmlxh0z.mongodb.net/' } = process.env;

export const client = new MongoClient(MONGO_URI);
export const db = client.db();
