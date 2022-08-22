import { useState } from "react";
import ShortUniqueId from "short-unique-id";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const uid = new ShortUniqueId();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoomHandler = () => {
    const id = uid();
    console.log(id, "short id");
    setRoomId(id);
    toast.success("Created a new room");
  };
  const joinRoomHandler = () => {
    if (!roomId || !username) {
      return toast.error("ROOM ID & USERNAME is Required");
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          className="homePageLoge"
          src="/code-sync.png"
          alt="code-editor-logo"
        />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            className="inputBox"
            type="text"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            placeholder="ROOM ID"
          />
          <input
            className="inputBox"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USERNAME"
          />
          <button className="btn joinBtn" onClick={joinRoomHandler}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invitation then create &nbsp;
            <a
              className="createNewBtn"
              onClick={(e) => {
                e.preventDefault();
                createNewRoomHandler();
              }}
            >
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Build with 💛 &nbsp; by &nbsp;
          <a>Vasim Aalam</a>
        </h4>
      </footer>
    </div>
  );
};

export default HomePage;
