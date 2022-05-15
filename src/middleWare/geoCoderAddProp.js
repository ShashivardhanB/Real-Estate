const NodeGeocoder = require('node-geocoder');
const validator = require('../utils/validator')


const geocodeAdd = async function (req, res, next) {

  try {
    const requestBody = req.body

    let { locationDetails } = requestBody

    if (!validator.isValid(locationDetails)) {
      return res.status(400).send({ status: false, message: "provide the locationDetails  " })
    }

    locationDetails = JSON.parse(locationDetails)

    const { locality, street, city } = locationDetails

    if (["Hyderabad","Mumbai","Bangalore","Chennai","Delhi"].indexOf(city) === -1) {
      return res.status(400).send({ status: false, message: "city must be any one of this Hyderabad,Mumbai,Bangalore,Chennai,Delhi" })
    }
    if (!validator.isValidName(locality)) {
      return res.status(400).send({ status: false, message: "locality is invalid" })
    }

    if (!validator.isValidStreet(street)) {
      return res.status(400).send({ status: false, message: "street is invalid" })
    }


    req.body['locationDetails'] = locationDetails



    const options = {
      provider: "mapquest",
      apiKey: "N2jY7vfTFKY3ibFarSgm9tW17GejaNPZ",
      formatter: null
    };

    const geocoder = NodeGeocoder(options);

    let locationData = locality + ',' + city + ' ' + "India"

    const data = await geocoder.geocode(locationData);

    if (data[0].hasOwnProperty('longitude') && data[0].hasOwnProperty('longitude')) {
      if (data[0].longitude == null || data[0].latitude == null, data[0].longitude == undefined || data[0].latitude == undefined) {
        return res.status(400).send({ status: false, message: "please provide valid  location data" })
      }

    }else{
      return res.status(400).send({status:false,message:"please provide valid  location data"})
    }


    let location = {
      type: "Point",
      coordinates: [data[0].longitude, data[0].latitude]
    }

    req.body['location'] = location
    

    next()

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }

}


module.exports = { geocodeAdd }