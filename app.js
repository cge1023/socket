const express = require("express");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", function (socket) {
  console.log("Server Socket Connected");

  socket.on("hello", (msg) => {
    console.log(msg);
    socket.emit("hello from server", "hello : 안녕");
  });
  socket.on("study", (msg) => {
    console.log(msg);
    socket.emit("study from server", "study : 공부합시다");
  });
  socket.on("bye", (msg) => {
    console.log(msg);
    socket.emit("bye from server", "bye : 잘가");
  });
});

http.listen(8000, () => {
  console.log("Sever : ", 8000);
});
