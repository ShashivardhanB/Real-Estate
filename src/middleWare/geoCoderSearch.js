const NodeGeocoder = require('node-geocoder');
const validator = require('../utils/validator')


const geocode = async function (req, res, next) {

  try {
    const requestBody = req.body
    const city = req.params.city

    let { locality } = requestBody

  
    if(!validator.isValidRequestBody(requestBody)){
        return res.status(400).send({status:false,message:" invalid request"})
    }

   

    if (!validator.isValidName(city)) {
      return res.status(400).send({ status: false, message: "city is invalid" })
    }
    if (!validator.isValidName(locality)) {
      return res.status(400).send({ status: false, message: "locality is invalid" })
    }




  
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


module.exports = { geocode }