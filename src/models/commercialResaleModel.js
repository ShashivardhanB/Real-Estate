const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const commercialReSaleSchema = new mongoose.Schema({

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

        propertyType: {
            type: String,
            required: true,
            trim: true,
            enum: ["Office Space", "Co-Working", "Shop", "Showroom", "Godown/Warehouse", "Industrial Shed", "Industrial Building", "Restaurant/Cafe", "Other Business"]
        },

        buildingType: {
            type: String,
            required: true,
            trim: true,
            enum: ["Independent House", "Business Park", "Mall", "Standlone Building", "Independent Shop"]
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
            enum: ["Less than a Year", "1 to 3 Year", "3 to 5 Year", "5 to 10 Year", "More than 10 Year"]
        },

        bulidingAreaInSqFeet: {
            type: String,
            trim:true,
            required: true
        },
        carpetAreaInSqFeet: {
            type: Number,
            required: true
        },
        furnishing: {
            type: String,
            required: true,
            trim: true,
            enum: ["Furnished", "Unfurnished", "Semi-furnished"]
        },

    },
    resaleDetails: {
        expectedPrice: {
            type: String,
            required: true,
            trim:true
        },
      
        availableFrom: {
            type: Date,
            required: true
        },
      
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



module.exports = mongoose.model("commercialResale", commercialReSaleSchema)