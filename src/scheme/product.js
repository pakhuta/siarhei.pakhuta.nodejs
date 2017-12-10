import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    reviews: [String]
});

export default ProductSchema;
