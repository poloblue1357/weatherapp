import mongoose from "mongoose";

const exitSchema = new mongoose.Schema({

    city: { type: String },
    country: { type: String },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    name: { type: String, required: true }, // exit name should be required
    email: { type: String, required: true},
    zip: { type: String }, // changed to string for leading zeros

}, { timestamps: true });

const Exit = mongoose.model("Exit", exitSchema);
export default Exit;
