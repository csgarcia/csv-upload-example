const path = require("path");
const express = require("express");
const csv = require("fast-csv");
const os = require("os");
const fs = require("fs");
const app = express();
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/upload.html"));
});

app.post("/upload", (req, res) => {
  let files = req.files || null;
  let type = req.body["type"] || null;

  console.log({ files, type });

  if (!files || Object.keys(files).length === 0 || !type) {
    res.redirect(`/?status=error&code=1001`);
    return;
  }

  let file = files.csv;
  convertFile(file)
    .then((response) => {
      let url = "/?status=success";
      if (!response.success) {
        let responseErrorMessage = response.message
          ? encodeURIComponent(response.message)
          : "";
        url = `/?status=error&code=${0}&message=${responseErrorMessage}`;
      }
      res.redirect(url);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ error: e.message });
    });
});

const convertFile = (file) => {
  return new Promise((resolve, reject) => {
    let items = [];
    fs.createReadStream(file.tempFilePath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (err) => {
        reject(err);
      })
      .on("data", (row) => {
        items.push(row);
      })
      .on("end", async (rowCount) => {
        console.log({ rowCount, itemsLength: items.length });
        return resolve({ success: true });
      });
  });
};

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
