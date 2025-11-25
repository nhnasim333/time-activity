const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const client = new MongoClient(process.env.DATABASE_URL);

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db('activity_timeline');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) throw new Error('Database not initialized');
    return db;
};

module.exports = { connectDB, getDB };
