const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
mongoose.connect("mongodb://127.0.0.1:27017/DegreeCore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() =>
    console.log(
      "==============Mongodb Database Connected Successfully=============="
    )
  )
  .catch((err) => console.log("Database Not Connected !!!"));
