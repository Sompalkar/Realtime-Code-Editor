import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import mainlogo from "../assets/Untitledlogo.svg";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username are required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="   flex  items-center justify-center min-h-screen bg-gray-300">
      <div className="w-[90%]  md:w-auto bg-white p-8 shadow-lg rounded-2xl ">
        <img
          className="mx-auto mb-4 h-40 w-80 "
          src={mainlogo}
          alt="code-sync-logo"
        />
        <h4 className="text-center text-lg font-semibold mb-4">
          Paste invitation ROOM ID
        </h4>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:border-blue-500"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:border-blue-500"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-blue-600"
            onClick={joinRoom}
          >
            Join Now
          </button>
        </div>
        <span className="text-center block">
          If you don't have an invite then create &nbsp;
          <a
            onClick={createNewRoom}
            href=""
            className="text-blue-500 hover:underline"
          >
            new room
          </a>
        </span>
      </div>
    </div>
  );
};

export default Home;
