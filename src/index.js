const express = require("express");
require("dotenv").config();
require("./database");

const app = express();

app.set("port", process.env.PORT);

app.use("/", require("./routes/animals"));

app.listen(app.get("port"), () =>
  console.log("Aplicación en puerto:", app.get("port"))
);
