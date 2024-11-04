import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    profile_image:{type:String},
    created_at:{type:String,required:true}
  },
  {
    versionKey: false
  }
);

const UserModel = mongoose.model("user", userSchema);

export { UserModel };
