const commercialRentModeal = require('../models/commercialRentModel');
const validator = require('../utils/validator')
const awsSNS = require('../utils/awsSNS')
const userModel = require('../models/userModel')



const commercialRentSearch = async function (req, res) {
    try {

        const requestBody = req.body

        const {
            location,
            apartmentType,
            bhkType
        } = requestBody

        const finalFilter = {
            status: "Active"
        }

        if ("apartmentType" in req.body) {

            if (["Apartment", "Independent House/Villa", "Gated Community Villa"].indexOf(apartmentType) === -1) {
                res.status(400).send({
                    status: false,
                    message: "apartmentType should be any one of these i.e  Apartment,Independent House/Villa,Gated Community Villa"
                })
            }
            finalFilter['propertyDetails.apartmentType'] = apartmentType

        }

        if ("bhkType" in req.body) {

            if (["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"].indexOf(bhkType) === -1) {
                return res.status(400).send({
                    status: false,
                    message: "bhkType should be any one of these i.e  1 RK,1 BHK,2 BHK,3 BHK,4 BHK,4+ BHK"
                })
            }
            finalFilter['propertyDetails.bhkType'] = bhkType
        }

        finalFilter['location.coordinates'] = [location.coordinates[0], location.coordinates[1]]


        const searchData = await commercialRentModeal.find(finalFilter)


        if (searchData.length === 0) {
            return res.status(404).send({
                status: false,
                message: "No properties found witb this location"
            })
        }


        return res.status(200).send({
            status: true,
            message: "Data found ",
            data: searchData
        })


    } catch (err) {
        return res.status(500).send({
            status: false,
            messsage: err.messsage
        })
    }


}

const commercialRentinterest = async function (req, res) {
    try {

        const requestedParams = req.params
        const {
            userId,
            propertyId
        } = requestedParams

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({
                status: false,
                message: "userId is valid"
            })
        }
        if (!validator.isValidObjectId(propertyId)) {
            return res.status(400).send({
                status: false,
                message: "propertyId is valid"
            })
        }

        const isUserExist = await userModel.findById(userId)
        if (!isUserExist) {
            return res.status(404).send({
                status: false,
                message: "user data not found"
            })
        }

        if (userId != req.userId) {
            return res.status(403).send({
                status: false,
                message: "you are unauthorized to access resources "
            })
        }


        const isPropertyExist = await commercialRentModeal.findById(propertyId).populate('userId')

        if (isPropertyExist.userId._id == userId) {
            return res.status(400).send({
                status: false,
                message: "you cant show interest to your own property "
            })
        }

        await awsSNS.sendSMSForOwner(isPropertyExist.userId.phone, isUserExist.name, isUserExist.phone, "commercial rent", isPropertyExist.locationDetails.city, isPropertyExist.locationDetails.locality)

        return res.status(200).send({
            status: true,
            message: "your details sent to the property owner"
        })



    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }

}

module.exports = {
    commercialRentSearch,
    commercialRentinterest
}