import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import postsRoutes from "./routes/postsRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Gunakan routes modular
app.use("/api/posts", postsRoutes);

// Middleware error handler global
app.use(errorHandler);

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di: http://localhost:${PORT}`);
});
