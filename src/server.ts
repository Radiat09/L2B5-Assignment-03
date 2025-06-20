import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let server: Server;

const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgalepw.mongodb.net/L2A3_Library_Management?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to Mongodb using Mongoose!!!");
    server = app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
