const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const residentalResaleSchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "User",
        required: true,
        trim: true
    },

    locationDetails: {
        city: {
            type: String,
            required: true,
            trim: true,
            enum:["Hyderabad","Mumbai","Bangalore","Chennai","Delhi"]
        },
        locality: {
            type: String,
            required: true,
            trim: true
        },
        street: {
            type: String,
            required: true,
            trim: true
        },

    },


    location: {
        type: {
            type: String,
            required: true,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },


    propertyDetails: {

        apartmentType: {
            type: String,
            required: true,
            trim: true,
            enum: ["Apartment", "Independent House/Villa", "Gated Community Villa"]
        },

        bhkType: {
            type: String,
            required: true,
            trim: true,
            enum: ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"]
        },

        floorForResale: {
            type: String,
            required: true,
            trim: true
        },
        totalFloor: {
            type: String,
            required: true,
            trim: true
        },
        propertyAge: {
            type: String,
            required: true,
            trim: true,
            enum: ["Under Construction", "Less than a Year", "1 to 3 Year", "3 to 5 Year", "5 to 10 Year", "More than 10 Year"]

        },
        
        facing: {
            type: String,
            default: "Dont Know",
            trim: true,
            enum: ["Dont Know", "North", "South", "East", "West", "North East", "North West", "South East", "South West"]
        },
        floorType: {
            type: String,
            trim: true,
            enum: ["Vitrified Tiles", "Mosaic", "Marble/Granite", "Wooden", "Cement"]
        },
        BulidingAreaInSqFeet: {
            type: String,
            required: true
        },
        CarpetAreaInSqFeet: {
            type: String,
            required: true
        }
    },



    resaleDetails: {
        expectedPrice: {
            type: String,
            required: true
        },
        MaintenanceCost: {
            type: String,
            required: true
        },
        availableFrom: {
            type: Date,
            required: true
        },
    
        KitchenType: {
            type: String,
            required: true,
            trim: true,
            enum:["Modular","Covered Shelves","Open Shelves"]
        },
        furnishing: {
            type: String,
            required: true,
            trim: true,
            enum: ["Furnished", "Unfurnished", "Semi-furnished"]
        },
        parking: {
            type: String,
            required: true,
            trim: true,
            enum: ["Bike", "Car", "No","Both"]
        }
    },

    photos: {
        type: [String],
        maxlength: 5
    },

    status: {
        type: String,
        default:"Active",
        trim: true,
        enum: [ "Active", "Inactive"]
    }


}, {
    timestamps: true
})



module.exports = mongoose.model("residentialResale", residentalResaleSchema)