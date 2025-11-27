import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export async function connectDB() {
    try {
        const mongodb_uri = process.env.MONGODB_URI
        if(!mongodb_uri){
            console.log('mongodb_uri is missing !')       }
        await mongoose.connect(mongodb_uri, {
            dbName: "CeropeDemoDB"
        })
        console.log("✅ Connected to MongoDB ");
    } catch (error) {
        console.error("MongoDB Connection Error ❌:", error.message);
    }
}

// Handle database disconnections and attempt reconnections
mongoose.connection.on("disconnected", () => {
  console.error("⚠️ MongoDB Disconnected! Retrying...");
  connectDB();
});


