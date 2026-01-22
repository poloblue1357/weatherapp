import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String },
    lat: { type: Number },
    lon: { type: Number },
    weather: {
        description: String,
        temperature: String,
        humidity: String,
        pressure: String,
        windSpeed: String,
        windType: String,
        windDirection: String,
        windGusts: String,
        sunrise: String,
        sunset: String,
        lastUpdated: String
    }
}, { timestamps: true });

const Location = mongoose.model("Location", locationSchema);
export default Location;
