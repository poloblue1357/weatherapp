import mongoose from "mongoose";

const weatherModelSchema = new mongoose.Schema({

       // current weather info
    weather: {
        temp: { type: Number },
        condition: { type: String }, 
        windSpeed: { type: Number },
        windType: { type: String },
        windDirection: { type: String },
        windDirectionCode: { type: String },
        windDirectionDegrees: { type: Number },
        windGusts: { type: Number },
        sunrise: { type: String },
        sunset: { type: String },
        lastUpdate: { type: String },
        timezone: { type: Number },
        visibility: { type: Number },
        pressure: { type: Number },
        humidity: { type: Number },
    },

    // forecast array (each entry is a subdocument)
    forecast: [
        {
            date: { type: String },
            time: { type: String },
            temp: { type: Number },
            windSpeed: { type: Number },
            degree: { type: Number },
            direction: { type: String },
            gust: { type: Number },
            condition: { type: String },
            description: { type: String },
            clouds: { type: Number },
            pressure: { type: Number },
            precipitation: { type: Number },
        }
    ]

}, { timestamps: true })

const weatherModel = mongoose.model("weatherModel", weatherModelSchema);
export default weatherModel;