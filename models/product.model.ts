import { Schema, models, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    orders: {
        type: [Schema.Types.ObjectId],
        ref: "Order",
    },
    category: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);
