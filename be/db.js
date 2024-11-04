import mongoose from "mongoose";

export const connectToDatabase = (DB_URL) => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => {
      console.log("Database connection error:", err);
    });
};
