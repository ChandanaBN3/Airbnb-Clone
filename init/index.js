const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:'694e06363d1d26bdd4dc0d85'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}

initDB();