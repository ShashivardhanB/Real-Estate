const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const residentalRentSchema = new mongoose.Schema({

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
            enum:["Apartment","Independent House/Villa","Gated Community Villa"]
        },
        apartmentName: {
            type: String,
            required: true,
            trim: true
        },
        bhkType: {
            type: String,
            required: true,
            trim: true,
            enum:["1 RK","1 BHK","2 BHK","3 BHK","4 BHK","4+ BHK"]
        },
        floorForRent: {
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
            enum:["Less than a Year","1 to 3 Year","3 to 5 Year","5 to 10 Year","More than 10 Year"]
        },
        facing: {
            type: String,
            default:"Dont Know",
            trim: true,
            enum:["Dont Know","North","South","East","West","North East","North West","South East","South West"]
        },
        BulidingAreaInSqFeet: {
            type: String,
            required: true
        }

    },



    rentalDetails: {
        expectedRent: {
            type: Number,
            required: true
        },
        expectedDeposit: {
            type: Number,
            required: true
        },
        availableFrom: {
            type: Date,
            required: true
        },
        preferredTenants: {
            type: String,
            required: true,
            trim: true,
            enum: ["Family", "Bachelor","Both"]
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
            enum: ["Bike", "Car", "No"]
        }
    },

    photos: {
        type: [String],
        maxlength: 10
    },

    status: {
        type: String,
        default:"Active",
        trim: true,
        enum: ["Active", "Inactive"]
    }






}, {
    timestamps: true
})



module.exports = mongoose.model("residentialRent", residentalRentSchema)