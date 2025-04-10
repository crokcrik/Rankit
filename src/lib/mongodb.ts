import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Global variable to maintain connection across hot reloads in development
const globalMongo = global as unknown as {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

// Initialize the cached connection variable
if (!globalMongo.mongoose) {
  globalMongo.mongoose = { conn: null, promise: null };
}

// Function to connect to MongoDB
async function dbConnect() {
  // If we have a connection, return it
  if (globalMongo.mongoose.conn) {
    return globalMongo.mongoose.conn;
  }

  // If a connection is already being established, wait for it
  if (globalMongo.mongoose.promise) {
    globalMongo.mongoose.conn = await globalMongo.mongoose.promise;
    return globalMongo.mongoose.conn;
  }

  // Create a new connection
  try {
    const options = {
      bufferCommands: false,
    };

    globalMongo.mongoose.promise = mongoose.connect(process.env.MONGODB_URI!, options);
    globalMongo.mongoose.conn = await globalMongo.mongoose.promise;
    
    return globalMongo.mongoose.conn;
  } catch (e) {
    globalMongo.mongoose.promise = null;
    throw e;
  }
}

export default dbConnect; 