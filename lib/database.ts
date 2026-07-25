import mongoose from "mongoose";
import dns from "dns/promises";

dns.setServers([ "1.1.1.1", "1.0.0.1", "8.8.8.8" ]);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is undefined!");
}

export async function connect() {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        await mongoose.connect(MONGODB_URI!);
        console.log("Database connected successfully!");
    } catch (e) {
        throw new Error("[ERROR]:", e!);
    }
}
