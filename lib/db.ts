// chatapp/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch(error => {
      console.error('MongoDB connection failed:', error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Define schema
const ExchangeSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Get or create model
async function getExchangeModel() {
  const conn = await connectDB();
  return conn.models.Exchange || conn.model("Exchange", ExchangeSchema);
}

export async function saveExchange(question: string, answer: string) {
  const Exchange = await getExchangeModel();
  const doc = new Exchange({ question, answer });
  await doc.save();
  return doc;
}

export async function getAllExchanges() {
  const Exchange = await getExchangeModel();
  return Exchange.find().sort({ createdAt: -1 }).lean();
}