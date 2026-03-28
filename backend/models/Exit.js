import mongoose from "mongoose";

const exitSchema = new mongoose.Schema({

    id: { type: String },
    slug: { type: String },
    telephone: { type: String },
    website: { type: String},
    city: { type: String },
    country: { type: String },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    name: { type: String, required: true }, // exit name should be required
    email: { type: String, match: /.+\@.+\..+/ },
    zip: { type: String }, // changed to string for leading zeros
    state: { type: String },
    source: { type: String } // scraped, user, manual

}, { timestamps: true });

const Exit = mongoose.model("Exit", exitSchema);
export default Exit;
