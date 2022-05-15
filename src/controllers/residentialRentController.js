const residentialRentModel = require('../models/residentialRentModel');
const validator = require('../utils/validator')
const moment = require('moment');
const awsFile = require('../utils/awsS3');





const residentialRentCreate = async function (req, res) {

    try {


        const requestBody = req.body
        const userId = req.params.userId

        let {
            locationDetails,
            propertyDetails,
            rentalDetails,
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

        if (!validator.isValid(rentalDetails)) {
            return res.status(400).send({
                status: false,
                message: "rentalDetails is mandatory"
            })
        }

        propertyDetails = JSON.parse(propertyDetails)

        const {
            apartmentType,
            apartmentName,
            bhkType,
            floorForRent,
            totalFloor,
            propertyAge,
            facing,
            BulidingAreaInSqFeet
        } = propertyDetails


        if (["Apartment", "Independent House/Villa", "Gated Community Villa"].indexOf(apartmentType) === -1) {
            res.status(400).send({
                status: false,
                message: "apartmentType should be any one of these i.e  Apartment,Independent House/Villa,Gated Community Villa"
            })
        }

        if (!validator.isValidName(apartmentName)) {
            return res.status(400).send({
                status: false,
                message: "apartmentName is invalid"
            })
        }

        if (["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"].indexOf(bhkType) === -1) {
            return res.status(400).send({
                status: false,
                message: "bhkType should be any one of these i.e  1 RK,1 BHK,2 BHK,3 BHK,4 BHK,4+ BHK"
            })
        }


        if (!validator.isValidNumber(floorForRent)) {
            return res.status(400).send({
                status: false,
                message: "floorForRent must be number"
            })
        } else if (floorForRent > 100) {
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

        if (["Less than a Year", "1 to 3 Year", "3 to 5 Year", "5 to 10 Year", "More than 10 Year"].indexOf(propertyAge) === -1) {
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

        rentalDetails = JSON.parse(rentalDetails)


        const {
            expectedRent,
            expectedDeposit,
            availableFrom,
            preferredTenants,
            parking,
            furnishing
        } = rentalDetails


        if (!validator.isValidNumber(expectedRent)) {
            return res.status(400).send({
                status: false,
                message: "expectedRent must be Number"
            })
        }

        if (!validator.isValidNumber(expectedDeposit)) {
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
        } else {

        }

        if (["Family", "Bachelor", "Both"].indexOf(preferredTenants) === -1) {
            return res.status(400).send({
                status: false,
                message: "preferredTenants must be valid and any one of these   Family, Bachelor,Both "
            })
        }
        if (["Furnished", "Unfurnished", "Semi-furnished"].indexOf(furnishing) === -1) {
            return res.status(400).send({
                status: false,
                message: "furnishing must be valid and any one of these   Furnished, Unfurnished, Semi-furnished "
            })
        }
        if (["Bike", "Car", "No"].indexOf(parking) === -1) {
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
            rentalDetails: rentalDetails,
            propertyDetails: propertyDetails,
            photos: photos,
            location: location

        }
        console.log(data)

        const propertyData = await residentialRentModel.create(data)

        return res.status(201).send({
            status: true,
            message: "Sucess",
            data: propertyData
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }




}

const getPropertiesRentRes = async function (req, res) {
    try {
        const userId = req.body.userId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                message: "userId is invalid"
            })
        }

        const propertiesData = await residentialRentModel.find({
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



const residentialRentStatus = async function (req, res) {
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
    if (userId != req.userId) {
        return res.status(403).send({
            status: false,
            message: "you are unauthorized to access resources "
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



    const updateStatus = await residentialRentModel.findOneAndUpdate({
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
    residentialRentCreate,
    residentialRentStatus,
    getPropertiesRentRes

}