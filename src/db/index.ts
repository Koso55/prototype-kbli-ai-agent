import mongoose from "mongoose";

async function initDbConnection(dbUri: string) {
  try {
    await mongoose.connect(dbUri as string, {
      maxPoolSize: 20,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("DB connected");
  } catch (error) {
    console.log("Could not connect to db", error);
    process.exit(1);
  }
}

export default initDbConnection;
