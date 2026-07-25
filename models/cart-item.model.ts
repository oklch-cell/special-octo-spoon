import { Schema, models, model } from 'mongoose';

const cartItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const CartItem = models.CartItem || model('CartItem', cartItemSchema);
