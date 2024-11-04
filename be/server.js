import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./routes/authRoutes.js";
import { connectToDatabase } from "./db.js";
import fileUpload from "express-fileupload";
import { todoRouter } from "./routes/todoRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

dotenv.config();

const DB_URL = process.env.DB_URL;
connectToDatabase(DB_URL);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/todo", authMiddleware,todoRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
