const isDev = process.env.NODE_ENV !== "production";

export const server = isDev ? "http://localhost:3000/api" : "https://what-should-i-do.vercel.app/api";
export const socket_server = isDev ? "http://localhost:7900" : "https://should-do-backend.onrender.com/";

export const googleApiKey = process ? process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "" : "";
