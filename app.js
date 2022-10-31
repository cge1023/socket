const express = require("express");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("chat");
});

var client_list = {};
// {소켓아이디 : 이름}
io.on("connection", function (socket) {
  socket.on("message", (data) => {
    console.log("message data", data);
    // msg 받아서 전체 클라이언트한테 전송 -> io
    if (data.dm == "all") {
      io.emit("send", data);
    } else {
      // 본인이 보내고 싶은 클라이언트의 id를 to 안에 쓰면 해당하는 사람에게만 보내짐
      io.to(data.dm).emit("send", data);
    }
  });
  socket.on("notice", (name) => {
    // msg 받아서 전체 클라이언트한테 전송 -> io
    // indexOf : ()안에 값이 존재 할 경우 index값 return 고로, -1 보다 크면 중복되는 이름이 존재하는 것.
    if (Object.values(client_list).indexOf(name) > -1) {
      socket.emit("err", "중복되는 이름입니다.");
    } else {
      client_list[socket.id] = name;
      console.log(client_list);
      io.emit("notice", `${name}님이 입장하셨습니다.`, client_list);
      socket.emit("entrySuccess", `${name}님 입장 성공했습니다.`);

      io.emit("clientUpdate", client_list);
    }
  });

  socket.on("disconnect", () => {
    delete client_list[socket.id];
    io.emit("clientUpdate", client_list);
  });
});

http.listen(8000, () => {
  console.log("Sever : ", 8000);
});
