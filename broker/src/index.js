const server = require("http").createServer();
const io = require("socket.io")(server, { path: "/netflix-broker/socket.io" });
const handles = require("./handles");
io.on("connection", async socket => {
  await handles.newPeer(socket.id);

  socket.on("peer", async data => {
    const posPeer = await handles.setSignal(socket.id, data);
    socket.emit("peer-id", posPeer);
  });
  socket.on("get-signal", async posPeer => {
    const signal = await handles.getSignal(posPeer);
    socket.emit("incoming-signal", signal);
  });
  socket.on("set-answer", async ({ signal, id: posPeer }) => {
    const socketID = await handles.getSocketIDByPosPeer(posPeer);
    if (socketID) {
      io.to(socketID).emit("answer-signal", signal);
    }
  });
  socket.on("disconnect", async () => {
    await handles.deletePeer(socket.id);
  });
});

server.listen(process.env.PORT || 4003);
