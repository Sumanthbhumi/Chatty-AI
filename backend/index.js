import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
} from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: ["CLIENT_URL"],
    credentials: true,
  }),
);

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// app.get("/api/test", ClerkExpressWithAuth(), (req, res) => {
//   if (!req.auth || !req.auth.userId) {
//     console.log("failed");
//     return res.status(401).send("Unauthenticated!");
//   }
//   console.log("Authenticated request:", req.auth.userId);
//   console.log("success");
// });

app.post("/api/chats", ClerkExpressWithAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF USERCHAT EXISTS
    const userChat = await UserChats.find({ userId: userId });

    if (!userChat.length) {
      // CREATE A NEW USERCHAT
      const newUserChat = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 20),
          },
        ],
      });
      await newUserChat.save();
    } else {
      // UPDATE USERCHAT
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: { _id: savedChat._id, title: text.substring(0, 20) },
          },
        },
      );

      res.status(201).send(newChat._id);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating chat");
  }
});

app.get("/api/userchats", ClerkExpressWithAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId });

    res.status(200).send(userChats[0].chats);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching user chats");
  }
});

app.get("/api/chats/:id", ClerkExpressWithAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) {
      return res.status(404).send("Chat not found");
    }
    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching chat");
  }
});

app.post("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  console.log("Authenticated User ID:", userId);
  const { question, answer, img } = req.body;
  console.log("Request Body:", req.body);

  const newItem = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer, img }] },
  ];

  try {
    const chatExists = await Chat.findOne({ _id: req.params.id, userId });
    if (!chatExists) {
      return res.status(404).send("Chat not found");
    }

    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItem,
          },
        },
      },
    );

    // Optionally fetch and return the updated chat
    const updatedChatData = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(updatedChatData);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).send("Error sending message");
  }
});

app.use(express.static(path.join(__dirname, "../client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
