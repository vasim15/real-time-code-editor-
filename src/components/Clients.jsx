import React from "react";
import Avater from "react-avatar";

const Clients = ({ username }) => {
  return (
    <div className="client">
      <Avater name={username} size={50} round="14px"/>
      <span className="userName">{username}</span>
    </div>
  );
};

export default Clients;
