import React from "react";
import { io, Socket } from "socket.io-client";

import { socket_server } from "config";
import { UserType } from "types";

interface useSocketInterface {
  user: null | UserType;
}

function useSocket({ user }: useSocketInterface) {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    if (!user) return;
    const socket = io(socket_server);
    setSocket(socket);
    socket.emit("LOGIN", { name: user.name });
    return () => void socket.disconnect();
  }, [user]);

  return { socket };
}

export default useSocket;
