import io from "socket.io-client";
export default () => {
  const option = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  return io(process.env.REACT_APP_BACKEND_URL, option);
};
