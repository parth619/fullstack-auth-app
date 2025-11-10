// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // keep both so either can be used
    username: { type: String, trim: true, unique: true, sparse: true },
    name: { type: String, trim: true },

    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// helper for login
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Use existing model if already compiled (avoids OverwriteModelError on reload)
export const User = mongoose.models.User || mongoose.model("User", userSchema);

// Default export stays compatible with: 
//   import models from "../models/User.js"; const { User } = models;
export default { User };
