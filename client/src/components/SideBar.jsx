import React from "react";
import Client from "../components/Client";

const SideBar = ({ clients }) => {
  // Filter unique clients based on username
  const uniqueClients = clients.reduce((unique, client) => {
    if (!unique.find((c) => c.username === client.username)) {
      unique.push(client);
    }
    return unique;
  }, []);

  return (
    <div className="h-full bg-gray-700 flex flex-col items-center gap-12 justify-start align-middle border-r-2">
      <div className="flex p-2 gap-2">
        <p className="text-xl font-bold text-white">Connected</p>
      </div>

      <div className="flex gap-4 flex-wrap flex-col mx-4">
        {uniqueClients.map((client) => (
          <Client key={client.socketId} username={client.username} />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
