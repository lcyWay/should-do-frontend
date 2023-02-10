const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://what-should-i-do.vercel.app"],
    optionsSuccessStatus: 200,
  })
);

const PORT = process.env.PORT || 7900;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:3000", "https://what-should-i-do.vercel.app"],
  },
});
io.on("connection", (socket) => {
  let username;
  console.log("socket connect:", socket.id);

  socket.on("LOGIN", async ({ name }) => {
    const collection = client.db("db").collection("users");
    username = name;
    collection.updateOne({ name }, { $set: { online: null } });
  });

  socket.on("disconnect", async () => {
    console.log("socket disconnect:", socket.id);
    const collection = client.db("db").collection("users");
    collection.updateOne({ name: username }, { $set: { online: new Date() } });
  });
});

async function start() {
  await client.connect();
  http.listen(PORT, () => console.log(`Example app listening at ${PORT}`));
}
start();

app.post("/send_email", async (req, res) => {
  const { email, name, link } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const data = await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "What Should I Do - Confirm Registration",
    html: `<b>Hello!</b><p>Dear ${name}!</p><p>Thanks for signing up with my todo! You must follow this link to activate your account: ${link}</p>`,
  });
  res.status(200).json(data);
});
