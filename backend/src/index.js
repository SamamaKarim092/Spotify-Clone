import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import songsRoutes from "./routes/song.routes.js";
import albumRoutes from "./routes/album.routes.js";
import statsRoutes from "./routes/stats.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true }));

app.use("/api/users" , userRoutes)
app.use("/api/admin" , adminRoutes)
app.use("/api/auth" , authRoutes)
app.use("/api/songs" , songsRoutes)
app.use("/api/albums" , albumRoutes)
app.use("/api/stats" , statsRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
})