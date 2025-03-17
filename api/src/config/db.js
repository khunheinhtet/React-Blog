import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGOOSE_URL);
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Database connection failed`, error);
    }
};

export default connectDB;
