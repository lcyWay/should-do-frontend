import { server, socket_server } from "../config";

export const api = async (url, data) => {
  return fetch(`${server}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r);
};

export const apiBeba = async (url, data) => {
  return await fetch(`${server}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());
};

export const api_back = async (url, data) => {
  return fetch(`${socket_server}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r);
};
