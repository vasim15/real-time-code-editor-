import express from "express";
import { Server } from "socket.io";
import actions from "../socket/actions.mjs";

const app = express();
const port = process.env.NODE_PORT || 4000;
const server = app.listen(port, () => {
  console.log(`server workin on port ${port}`);
});
const io = new Server(server);

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({ socketId, username: userSocketMap[socketId] })
  );
};

io.on("connection", (connection) => {
  console.log(`socket id ${connection.id} `);

  connection.on(actions.JOIN, ({ roomId, username }) => {
    userSocketMap[connection.id] = username;
    connection.join(roomId);
    const clients = getAllConnectedClients(roomId);
    console.log(`users ${JSON.stringify(userSocketMap)}`);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(actions.JOINED, {
        clients,
        username,
        socketId: connection.id,
      });
    });
  });

  connection.on(actions.CODE_CHANGE, ({ roomId, code }) => {
    connection.in(roomId).emit(actions.CODE_CHANGE, { code });
  });
  connection.on(actions.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(actions.CODE_CHANGE, { code });
  });
  const leave = () => {
    const rooms = [...connection.rooms];
    rooms.forEach((roomId) => {
      console.log(userSocketMap[connection.id]);
      connection.in(roomId).emit(actions.DISCONNECTED, {
        conectonId: connection.id,
        username: userSocketMap[connection.id],
      });
    });
    connection.leave(userSocketMap[connection.id]);
    delete userSocketMap[connection.id];
  };
  connection.on("disconnecting", leave);
  connection.on("leave", leave);

});
