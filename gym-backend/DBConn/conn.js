// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost:27017/gymBackend")
//   // netlify
//   // .connect("https://gym-backend-iota.vercel.app/")
//   .then(() => console.log("db connected"))
//   .catch((err) => {
//     console.log(err);
//   });



const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

// mongoose.connect("mongodb://localhost:27017/Market");

const connection = mongoose.connection;

connection.on('connected',()=>{
    console.log('mongo DB connection successful')
})

connection.on('error',(err)=>{
    console.log('mongo DB connection failed')
})
module.exports = connection;


