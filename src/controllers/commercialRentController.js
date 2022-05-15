const validator = require('../utils/validator')
const awsFile = require('../utils/awsS3');
const moment = require('moment');
const commercialRentModel = require('../models/commercialRentModel');




const commercialRentCreate = async function (req, res) {

    try {


        const requestBody = req.body

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
            propertyType,
            buildingType,
            floorForRent,
            totalFloor,
            propertyAge,
            bulidingAreaInSqFeet,
            furnishing
        } = propertyDetails


        if (["Office Space", "Co-Working", "Shop", "Showroom", "Godown/Warehouse", "Industrial Shed", "Industrial Building", "Restaurant/Cafe", "Other Business"].indexOf(propertyType) === -1) {
            res.status(400).send({
                status: false,
                message: "propertyType should be any one of these i.e Office Space, Co-Working, Shop, Showroom, Godown/Warehouse, Industrial Shed, Industrial Building, Restaurant/Cafe, Other Business"
            })
        }

        if (["Independent House", "Business Park", "Mall", "Standlone Building", "Independent Shop"].indexOf(buildingType) === -1) {
            res.status(400).send({
                status: false,
                message: "BuildingType should be any one of these i.e Independent House, Business Park, Mall,Standlone Building, Independent Shop"
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



        if (!validator.isValidNumber(bulidingAreaInSqFeet)) {
            return res.status(400).send({
                status: false,
                message: "BulidingAreaInSqFeet should be number "
            })
        }

        if (["Furnished", "Unfurnished", "Semi-furnished"].indexOf(furnishing) === -1) {
            return res.status(400).send({
                status: false,
                message: "furnishing must be valid and any one of these   Furnished, Unfurnished, Semi-furnished "
            })
        }

        rentalDetails = JSON.parse(rentalDetails)


        const {
            expectedRent,
            expectedDeposit,
            availableFrom,
            leaseDurationInYears,
            lockInPeriodInYears
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
        }

        if (!validator.isValidNumber(leaseDurationInYears)) {
            return res.status(400).send({
                status: false,
                message: "leaseDurationInYears must be number"
            })
        } else if (leaseDurationInYears > 100) {
            return res.status(400).send({
                status: false,
                message: "leaseDurationInYears must be less than 100 "
            })
        }


        if (!validator.isValidNumber(lockInPeriodInYears)) {
            return res.status(400).send({
                status: false,
                message: "lockInPeriodInYears must be number"
            })
        } else if (lockInPeriodInYears > 100) {
            return res.status(400).send({
                status: false,
                message: "lockInPeriodInYears must be less than 100 "
            })
        }


        if (leaseDurationInYears > lockInPeriodInYears) {
            return res.status(400).send({
                status: false,
                message: "lockInPeriodInYears  must greater than  leaseDurationInYears"
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
            locationDetails: locationDetails,
            rentalDetails: rentalDetails,
            propertyDetails: propertyDetails,
            photos: photos,
            location: location

        }

        const propertyData = await commercialRentModel.create(data)

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
const getPropertiesRentCom = async function (req, res) {
    try {
        const userId = req.body.userId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                message: "userId is invalid"
            })
        }

        const propertiesData = await commercialRentModel.find({
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

const commercialRentStatus = async function (req, res) {
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



    const updateStatus = await commercialRentModel.findOneAndUpdate({
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
    commercialRentCreate,
    commercialRentStatus,
    getPropertiesRentCom
}