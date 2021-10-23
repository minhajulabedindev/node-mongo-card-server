const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 5000;
//cors
app.use(cors());
app.use(express.json());

// user: mydbuser1
//password: ubt9JJbW8A6HKm0u

//---------------------
const uri =
  "mongodb+srv://mydbuser1:ubt9JJbW8A6HKm0u@cluster0.wehqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/////////////////////////////////////////////////////
async function run() {
  try {
    await client.connect();
    const database = client.db("FoodMaster");
    const usersCollection = database.collection("users");

    //GET API

    app.get("/users", async (req, res) => {
      const curser = usersCollection.find();
      const users = await curser.toArray();
      res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await usersCollection.findOne(query);
      // console.log('load user with id: ', id);
      res.send(user);
    });
    // post api

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      console.log("got new user", req.body);
      console.log("added user", result);
      res.json(result);
    });
    //UPDATE API
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating", id);
      res.json(result);
    });

    //Delete api

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);

      console.log("deleting user with id ", result);

      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

///
run().catch(console.dir);
//-----------------------------
app.get("/", (req, res) => {
  res.send("This is the get first NODE");
});

app.listen(port, () => {
  console.log("running server on port ", port);
});
