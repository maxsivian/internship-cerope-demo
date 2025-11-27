import "dotenv/config";
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
// import path from "path";
// import { fileURLToPath } from "url";

import { connectDB } from "./utils/connectDB.js";
import { checkENVs } from "./utils/checkENVs.js";

import authRoutes from "./routes/authRoutes.js"
import accountsRoutes from "./routes/accountRoutes.js"




const requiredENVs = ["PORT", "HOST", "JWT_SECRET", "MONGODB_URI", "GOOGLE_CLIENT_ID", "EMAIL_TRANSPORTER_USER", "EMAIL_TRANSPORTER_PASS", "CLIENT_BASE"]
checkENVs(requiredENVs)

const HOST = process.env.HOST
const PORT = process.env.PORT
const CLIENT_BASE = process.env.CLIENT_BASE

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename); 
const app = express();

// app.use(cors())

app.use(cors({
    origin: CLIENT_BASE,
    methods: ['GET', 'POST', "PUT", "DELETE"],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));


app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());


await connectDB()


app.use("/api/auth", authRoutes);
app.use("/api/account", accountsRoutes);


app.get("/", (req, res) => {
    res.send("🌐 INTERNSHIP CEROPE DEMO SERVER IS WORKING ✅");
});


app.listen(PORT, HOST, () => {
    console.log("\n===== INTERNSHIP CEROPE DEMO =====");
    console.log("✅ Server is up and running!");
    console.log(`🌐 http://${HOST}:${PORT}`);
    console.log("\n");
});







