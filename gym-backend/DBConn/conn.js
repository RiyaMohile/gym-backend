const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/gymBackend")
  // netlify
  // .connect("https://gym-backend-iota.vercel.app/")
  .then(() => console.log("db connected"))
  .catch((err) => {
    console.log(err);
  });





