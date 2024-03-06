import React from "react";
import logo from "../assets/codeshare-logo.png";
import mainlogo from "../assets/Untitledlogo.svg";

const Navbar = ({ copyRoomId, leaveRoom }) => {
  return (
    <div className="flex flex-row sm:flex-row w-full h-auto sm:h-20 px-4 p-2 gap-4 items-center justify-between">
      <div className="mb-4 sm:mb-0 w-full sm:w-auto">
        {/* <img className="h-20 w-48" src={mainlogo} alt="" /> */}
        <p className=" font-semibold text-xl md:text-5xl">Code Wync</p>
      </div>
      <div className="flex flex-row sm:flex-row gap-4 w-full sm:w-[30%] justify-around">
        <button
          type="button"
          className="bg-green-500 text-white h-12 px-8 py-0 rounded-2xl focus:outline-none mb-2 sm:mb-0"
          onClick={copyRoomId}
        >
          Share
        </button>
        <button
          type="button"
          className="bg-red-500 text-white h-12 px-8 rounded-2xl focus:outline-none"
          onClick={leaveRoom}
        >
          Leave
        </button>
      </div>
    </div>
  );
};

export default Navbar;
