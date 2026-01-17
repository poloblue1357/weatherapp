import mongoose from "mongoose"

// Define the schema for a saved location
const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },   // e.g. "New York"
    country: { type: String },                // optional, e.g., "US"
    lat: { type: Number },                  // optional latitude 
    lon: { type: Number }                   // optional longitude
}, { timestamps: true}); // automatically adds createdAt and updatedAt

// Export the model
const Location = mongoose.model("Location", locationSchema)
export default Location