import express from 'express';
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,       
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes);


app.get("/", (req, res) => {
  res.send("Hello, World! Server is running 🟢");
});

export default app;
