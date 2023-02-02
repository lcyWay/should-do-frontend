import { server } from "../config";

export const apiBeba = async (url, data) => {
  return await fetch(`${server}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());
};
