import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
    email: {
    type: String,
    required: true,
    unique: true,
  },
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
}, {timestamps: true });
// createdAt , updatedAt (iska matlb kai user kab sai aaya wagira)

export const User = mongoose.model("User", userSchema);