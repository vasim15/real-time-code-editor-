import React, { useEffect, useRef, useState } from "react";
import Clients from "../components/Clients";
import Editor from "../components/Editor";
import initSocket from "../socket/indexSocket";
import toast from "react-hot-toast";
import {
  useLocation,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import actions from "../socket/actions.mjs";
// const clients = [{ socketId: 1, username: "tushar" }];
const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const socket = useRef(null);
  const code = useRef(null);
  const { state } = useLocation();
  const { roomId } = useParams();
  const pageNavigate = useNavigate();

  console.log(state, "state");
  console.log(state.username, "username");
  console.log(clients, "clients");

  useEffect(() => {
    const init = () => {
      socket.current = initSocket();

      socket.current.emit(actions.JOIN, {
        roomId,
        username: state.username,
      });

      socket.current.on(
        actions.JOINED,
        ({ clients: serverClients, username, socketId }) => {
          if (username !== state.username) {
            toast.success(`${username} joined room`);
            console.log(`${username} joined`);
          }
          setClients(serverClients);
          socket.current.emit(actions.SYNC_CODE, {
            code: code.current,
            socketId,
          });
        }
      );

      socket.current.on(actions.DISCONNECTED, ({ conectonId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((pre) => {
          return pre.filter((client) => client.socketId !== conectonId);
        });
      });

      const errorHandler = (e) => {
        console.log("Socket Error", e);
        toast.error("Socket connection failed, try again later");
      };
      socket.current.on("connect_error", errorHandler);
      socket.current.on("connect_failed", errorHandler);
    };
    init();

    return () => {
      socket.current.emit("leave", {});
      socket.current.disconnect();
      socket.current.off(actions.JOIN);
      socket.current.off(actions.DISCONNECTED);
    };
  }, []);

  const copyRoomIdHandler = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to  your clipboard");
    } catch (err) {
      console.log(err);
    }
  };
  const leaveRoomHandler = () => {
    pageNavigate("/");
  };

  if (!state.username) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/code-sync.png" className="logoImage" alt="logo" />
          </div>
          <h3>Conntected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Clients key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomIdHandler}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoomHandler}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socket={socket}
          roomId={roomId}
          onCodeChange={(val) => {
            code.current = val;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
