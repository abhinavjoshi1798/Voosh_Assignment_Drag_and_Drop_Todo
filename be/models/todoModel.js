import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String,required:true },
    userEmail:{type:String,required:true},
    userId:{type:String,required:true},
    created_at:{type:String,required:true},
    is_deleted:{type:Boolean,required:true},
    new:{type:Boolean,required:true},
  },
  {
    versionKey: false
  }
);

const TodoModel = mongoose.model("todo", todoSchema);

export { TodoModel };
