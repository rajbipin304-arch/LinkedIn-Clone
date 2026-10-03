import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/users.routes.js";
import postRoutes from "./routes/post.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "../.env")
});


const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.use(postRoutes);
app.use(userRoutes);

const start = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        app.listen(9090, () => {
            console.log("Server is running on port 9090");
        });
    } catch (error) {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    }

};


start();