import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Available" },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);