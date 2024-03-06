import React from "react";
import Avatar from "react-avatar";
// import './Client.css'

const Client = ({ username }) => {
  return (
    <div className=" flex flex-col gap-2 items-center">
      <Avatar name={username} size={52} round="14px" />
      <span className="text-sm  px-1 font-semibold text-xl text-white">
        {username}
      </span>
    </div>
  );
};

export default Client;
