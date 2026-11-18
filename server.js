import "dotenv/config";
import { MongoClient } from "mongodb";
import express from "express";

var isConnectedToMongoDB = false;
const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    isConnectedToMongoDB = true;
    console.log("Connected successfully to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
const app = express();

app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  if (isConnectedToMongoDB) {
    res.status(200).send({ message: "Successfully connected to the database!" });
    return;
  }
  res.status(500).send({ message: "Failed to connect to the database." });
});

app.listen(port, () => console.log("Server running on port: " + port));
