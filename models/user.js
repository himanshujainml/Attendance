import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    role:{type:String},
    email: { type: String, required: true },
    password:{type:String, select: false},
    dateOfBirth: { type: String },
    gender: { type: String },
    phone: { type: Number, default: "" },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

const User = mongoose.model("User", userSchema);

export default User;