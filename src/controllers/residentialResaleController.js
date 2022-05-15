const residentialResaleModel = require('../models/residentialResaleModel')
const validator = require('../utils/validator')
const moment = require('moment');
const awsFile = require('../utils/awsS3')



const residentialResaleCreate = async function (req, res) {

    try {


        const requestBody = req.body
        const userId = req.params.userId

        let {
            locationDetails,
            propertyDetails,
            resaleDetails,
            location
        } = requestBody


        if (!validator.isValid(locationDetails)) {
            return res.status(400).send({
                status: false,
                message: "locationDetails is mandatory"
            })
        }
        if (!validator.isValid(propertyDetails)) {
            return res.status(400).send({
                status: false,
                message: "propertyDetails is mandatory"
            })
        }

        if (!validator.isValid(resaleDetails)) {
            return res.status(400).send({
                status: false,
                message: "resaleDetails is mandatory"
            })
        }

        propertyDetails = JSON.parse(propertyDetails)

        const {
            apartmentType,
            bhkType,
            floorForResale,
            floorType,
            totalFloor,
            propertyAge,
            facing,
            BulidingAreaInSqFeet,
            CarpetAreaInSqFeet
        } = propertyDetails


        if (["Apartment", "Independent House/Villa", "Gated Community Villa"].indexOf(apartmentType) === -1) {
            res.status(400).send({
                status: false,
                message: "apartmentType should be any one of these i.e  Apartment,Independent House/Villa,Gated Community Villa"
            })
        }

        if (["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"].indexOf(bhkType) === -1) {
            return res.status(400).send({
                status: false,
                message: "bhkType should be any one of these i.e  1 RK,1 BHK,2 BHK,3 BHK,4 BHK,4+ BHK"
            })
        }


        if (["Vitrified Tiles", "Mosaic", "Marble/Granite", "Wooden", "Cement"].indexOf(floorType) === -1) {
            return res.status(400).send({
                status: false,
                message: "floorType should be any one of these i.e  Vitrified Tiles, Mosaic, Marble/Granite, Wooden, Cement"
            })
        }

        if (!validator.isValidNumber(floorForResale)) {
            return res.status(400).send({
                status: false,
                message: "floorForRent must be number"
            })
        } else if (floorForResale > 100) {
            return res.status(400).send({
                status: false,
                message: "floorForRent must be less than 100 "
            })
        }


        if (!validator.isValidNumber(totalFloor)) {
            return res.status(400).send({
                status: false,
                message: "totalFloor must be number"
            })
        } else if (totalFloor > 100) {
            return res.status(400).send({
                status: false,
                message: "totalFloor must be less than 100 "
            })
        }

        if (["Under Construction", "Less than a Year", "1 to 3 Year", "3 to 5 Year", "5 to 10 Year", "More than 10 Year"].indexOf(propertyAge) === -1) {
            return res.status(400).send({
                status: false,
                message: "propertyAge is invalid it should be any one in (Less than a Year,1 to 3 Year,3 to 5 Year,5 to 10 Year,More than 10 Year) "
            })
        }

        if ("facing" in req.body) {

            if (["North", "South", "East", "West", "North East", "North West", "South East", "South West"].indexOf(facing) === -1) {

                return res.status(400), send({
                    status: false,
                    message: " facing  is invalid ,it should be any one of these i.e   North,South,East,West,North East,North West,South East,South West"
                })

            }
        }

        if (!validator.isValidNumber(BulidingAreaInSqFeet)) {
            return res.status(400).send({
                status: false,
                message: "BulidingAreaInSqFeet should be number "
            })
        }
        if (!validator.isValidNumber(CarpetAreaInSqFeet)) {
            return res.status(400).send({
                status: false,
                message: "BulidingAreaInSqFeet should be number "
            })
        }

        resaleDetails = JSON.parse(resaleDetails)


        const {
            expectedPrice,
            MaintenanceCost,
            availableFrom,
            KitchenType,
            parking,
            furnishing
        } = resaleDetails


        if (!validator.isValidNumber(expectedPrice)) {
            return res.status(400).send({
                status: false,
                message: "expectedRent must be Number"
            })
        }

        if (!validator.isValidNumber(MaintenanceCost)) {
            return res.status(400).send({
                status: false,
                message: "expectedDeposit must be Number"
            })
        }


        if (!moment(availableFrom, "DD-MM-YYYY", true).isValid()) {
            return res.status(400).send({
                status: false,
                message: "please provide  correct availableFrom date and in DD-MM-YYYY format"
            })
        }

        if (["Modular", "Covered Shelves", "Open Shelves"].indexOf(KitchenType) === -1) {
            return res.status(400).send({
                status: false,
                message: "preferredTenants must be valid and any one of these  Modular,Covered Shelves,Open Shelves "
            })
        }
        if (["Furnished", "Unfurnished", "Semi-furnished"].indexOf(furnishing) === -1) {
            return res.status(400).send({
                status: false,
                message: "furnishing must be valid and any one of these   Furnished, Unfurnished, Semi-furnished "
            })
        }
        if (["Bike", "Car", "No", "Both"].indexOf(parking) === -1) {
            return res.status(400).send({
                status: false,
                message: "parking must be valid and any one of these   Bike, Car, No "
            })
        }

        let photos = []

        const files = req.files

        if (files.length > 10) {
            return res.status(400).send({
                status: false,
                message: "  Number of  photos must less than 10"
            })
        }

        for (let i = 0; i < files.length; i++) {
            let file = await awsFile.uploadFile(files[i])
            photos.push(file)
        }

        let data = {
            userId: userId,
            locationDetails: locationDetails,
            resaleDetails: resaleDetails,
            propertyDetails: propertyDetails,
            photos: photos,
            location: location

        }

        const propertyResaleData = await residentialResaleModel.create(data)

        return res.status(201).send({
            status: true,
            message: "Sucess",
            data: propertyResaleData
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }




}
const getPropertiesResaleRes = async function (req, res) {
    try {
        const userId = req.body.userId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                message: "userId is invalid"
            })
        }

        if (userId != req.userId) {
            return res.status(403).send({
                status: false,
                message: "you are unauthorized to access resources "
            })
        }
        const propertiesData = await residentialResaleModel.find({
            userId: userId
        })

        if (propertiesData.length === 0) {
            return res.status(404).send({
                status: false,
                message: "no property found"
            })
        }
        return res.status(200).send({
            status: true,
            message: "Data Found",
            data: propertiesData
        })

    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


const residentialResaleStatus = async function (req, res) {
    const requestedParams = req.params

    const {
        userId,
        status,
        propertyId
    } = requestedParams

    if (!validator.isValidObjectId(userId)) {
        return res.status(400).send({
            status: false,
            message: "userId is not valid"
        })
    }

    if (!validator.isValidObjectId(propertyId)) {
        return res.status(400).send({
            status: false,
            message: "propertyId is not valid"
        })

    }


    if (["Active", "Inactive"].indexOf(status) === -1) {
        return res.status(400).send({
            status: false,
            message: "status must be any one of this Active ,Inactive "
        })
    }

    if (userId != req.userId) {
        return res.status(403).send({
            status: false,
            message: "you are unauthorized to access resources "
        })
    }



    const updateStatus = await residentialResaleModel.findOneAndUpdate({
        _id: propertyId,
        userId: userId
    }, {
        $set: {
            status: status
        }
    }, {
        new: true
    })

    if (!updateStatus) {
        return res.status(400).send({
            status: false,
            message: "this property is not belongs to you or property not found"
        })
    }

    return res.status(200).send({
        status: true,
        message: "Status updated successfuly",
        data: updateStatus
    })

}


module.exports = {
    residentialResaleCreate,
    residentialResaleStatus,
    getPropertiesResaleRes
}