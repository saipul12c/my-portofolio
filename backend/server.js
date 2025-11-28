import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import postsRoutes from "./routes/postsRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 3000;

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Gunakan routes modular
app.use("/api/posts", postsRoutes);

// Chatbot endpoint
app.post("/api/chat", async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });

  } catch (error) {
    next(error);
  }
});


// Middleware error handler global
app.use(errorHandler);

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di: http://localhost:${PORT}`);
});
