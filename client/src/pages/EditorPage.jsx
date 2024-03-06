import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Editor from "../components/Editor";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef("");
  const inputRef = useRef("");
  const outputRef = useRef("");
  const languageRef = useRef("");
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();
        socketRef.current.on("connect_error", (err) => handleErrors(err));
        socketRef.current.on("connect_failed", (err) => handleErrors(err));

        function handleErrors(e) {
          console.log("socket error", e);
          toast.error("Socket connection failed, try again later.");
          reactNavigator("/");
        }

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
        });

        // Listening for joined event
        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
              toast.success(`${username} joined the room.`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
            socketRef.current.emit(ACTIONS.SYNC_INPUT, {
              input: inputRef.current,
              socketId,
            });
            socketRef.current.emit(ACTIONS.SYNC_OUTPUT, {
              output: outputRef.current,
              socketId,
            });
            socketRef.current.emit(ACTIONS.SYNC_LANGUAGE, {
              language: languageRef.current,
              socketId,
            });
          }
        );

        // Listening for disconnected
        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        });
      } catch (error) {
        console.error("WebSocket initialization error:", error);
      }
    };
    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, [roomId, location.state, reactNavigator]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-col">
      <div className="bg-gray-800 text-white w-full h-20">
        <Navbar copyRoomId={copyRoomId} leaveRoom={leaveRoom} />
      </div>

      <div className=" flex  ">
        <div className="hidden md:block  ">
          <SideBar clients={clients} />
        </div>

        <div className=" w-full md:w-[92%]  bg-gray-700">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
            onInputChange={(input) => {
              inputRef.current = input;
            }}
            onOutputChange={(output) => {
              outputRef.current = output;
            }}
            onLanguageChange={(language) => {
              languageRef.current = language;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
