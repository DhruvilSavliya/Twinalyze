const express = require("express");

const http = require("http");

const app = require("./backend/app");

const port = process.env.PORT || 80;

const server = http.createServer(app);

const path = require("path");

const cors = require("cors");

app.use(cors());

app.use(express.static("./build"));

// app.get("/*", function (req, res) {
//   console.log(
//     "PATHHHHHHHHHHHHHHHHHh",
//     path.join(__dirname, "/build/index.html")
//   );
//   res.sendFile(path.join(__dirname, "/build/index.html"));
// });

app.get("*", (req, res) => {
  console.log(
    "INNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN"
  );
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
