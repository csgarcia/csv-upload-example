const path = require('path');
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/upload.html"));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
