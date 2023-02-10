import { server, socket_server } from "../config";

export const apiNextServer = async (url, data) => {
  return await fetch(`${server}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());
};

export const apiBackend = async (url, data) => {
  return await fetch(`${socket_server}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());
};

