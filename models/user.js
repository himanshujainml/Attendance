import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: { type: String, default: "" },
    phone: { type: Number, default: "" },
    role: { type: String },
    aadhar: { type: Number, default: "" },
    pan: { type: Number, default: "" },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    designation: { type: String },
    department: { type: String },
    // email: { type: String, required: true },
  },
  experienceInfo: {
    yearsOfExperience: { type: Number, default: "" },
    lastCompany: { type: String, default: "" },
    skills: { type: Array },
    degree: { type: String, default: "" },
    college: { type: String, default: "" },
  },
  bankInfo: {
    bankName: { type: String, default: "" },
    branchName: { type: String, default: "" },
    accountNumber: { type: Number, default: "" },
    IFSC: { type: Number, default: "" },
    bankProof: { type: String, default: "" },
  },
  parentDetails: {
    name: { type: String, default: "" },
    contact: { type: String, default: "" },
    doc1: { type: String, default: "" },
    doc2: { type: String, default: "" },
    additionalDetails: { type: String, default: "" },
  },
  documents: {
    degree: { type: String, default: "" },
    resume: { type: String, default: "" },
    tenth: { type: String, default: "" },
    twelth: { type: String, default: "" },
    salarySlip: { type: String, default: "" },
    experienceLetter: { type: String, default: "" },
  },
  password: { type: String, select: false },
  email: { type: String, required: true },
  code: { type: String, default: "" },
  isCodeUsed: { type: Boolean, default: false },
  codeCreateTime: { type: String, default: "" },
  isLogin: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);

export default User;
