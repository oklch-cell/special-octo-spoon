import { Schema, models, model } from "mongoose";
import { compare, hash } from "bcryptjs";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    address: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    orders: {
        type: [Schema.Types.ObjectId],
        ref: "Order",
    },
    role: {
        type: String,
    },
}, { timestamps: true });

userSchema.methods.encrypt = async function () {
    this.password = await hash(this.password, 10);
}

userSchema.methods.compare = async function (password: string) {
    return await compare(password, this.password);
}

export const User = models.User || model("User", userSchema);
