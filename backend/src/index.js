import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
// Remove fileUpload import - we'll use multiparty in controllers instead
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

// Updated CORS for production
app.use(
	cors({
		origin: process.env.NODE_ENV === "production" 
			? ["https://your-vercel-domain.vercel.app", "https://your-custom-domain.com"] 
			: "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json({ limit: '10mb' })); // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth

// Remove express-fileupload middleware - we'll handle multipart in controllers
// Don't use fileUpload middleware here

// Cron jobs - but skip in serverless environment
if (process.env.NODE_ENV !== "production") {
	const tempDir = path.join(process.cwd(), "tmp");
	cron.schedule("0 * * * *", () => {
		if (fs.existsSync(tempDir)) {
			fs.readdir(tempDir, (err, files) => {
				if (err) {
					console.log("error", err);
					return;
				}
				for (const file of files) {
					fs.unlink(path.join(tempDir, file), (err) => {});
				}
			});
		}
	});
}

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

// error handler
app.use((err, req, res, next) => {
	console.log("Error:", err);
	res.status(500).json({ 
		message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message 
	});
});

// For Vercel serverless
export default app;
if (process.env.NODE_ENV === "production") {
	// Export the app for Vercel
} else {
	// Local development server
	httpServer.listen(PORT, () => {
		console.log("Server is running on port " + PORT);
		connectDB();
	});
}