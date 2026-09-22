/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const user = useRecoilValue(userAtom);

  useEffect(() => {
    // Don't create socket connection if user is not logged in
    if (!user?._id) {
      setSocket(null);
      setOnlineUsers([]);
      return;
    }
    // ✅ CORRECT: Point directly to your backend server URL
    const SOCKET_URL =
      import.meta.env.VITE_API_URL ||
      "https://threads-clone-backend-z6sq.onrender.com";
    console.log(SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      query: {
        userId: user?._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
