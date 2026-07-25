import { Schema, models, model } from "mongoose";

const orderProductSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
})

const orderSchema = new Schema({
    products: {
        type: [orderProductSchema],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "DISPATCHED", "DELIVERED"],
        default: "PENDING",
    },
}, { timestamps: true });

export const Order = models.Order || model("Order", orderSchema);
