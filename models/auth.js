import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    verified:{type:Boolean,default: false},
    expirationTime: { type: String},
    code:{type:String,required: true},
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

const Auth = mongoose.model("Auth", authSchema);

export default Auth;