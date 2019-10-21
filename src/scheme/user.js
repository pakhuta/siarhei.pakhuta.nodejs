import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
});

export default UserSchema;
