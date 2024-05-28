import mongoose from 'mongoose'
import {ConnectionOptions} from "node:tls";

const connectDB = async () => {
    try {
        const s = await mongoose.connect('mongodb://mongo:27017/cardb');
        console.log(s);
        console.log("MongoDB connected");
    } catch (err) {
        console.log(err)
        if (err instanceof Error) {
            console.error(err.message);
        }
    }
}

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
    }
};

export {connectDB, disconnectDB};