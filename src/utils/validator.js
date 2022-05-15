const mongoose = require('mongoose')




const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    return true;
  }

const isValidName = function (value) {
     if (typeof value === 'undefined' || value === null) return false
    if (/^[a-zA-Z\s]+$/.test(value)) return true
    return false
}


const isValidPhoneNumber = function (value) {
    if (/^[6-9]{1}\d{9}$/.test(value.trim())) return true
    return false
}
const isValidNumber = function (value) {
  if (/^[0-9]+$/.test(value.trim())) return true
  return false
}

const isValidEmail = function (value) {
    if (/^([a-z0-9\.-]+)@([a-z0-9-]+).([a-z]+)$/.test(value.trim())) return true
    return false
}


const isValidStrongPassword = function (value) {
    if (/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,15})$/.test(value)) return true
    return false
  
  }

  const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
  }   


  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
  }  

  const isValidObject = function (value) {
    if (typeof (value) === "undefined" || value === null) return false;
    if (typeof (value) === "object" && Array.isArray(value) === false && Object.keys(value).length > 0) return true;
    return false;
  };

  const isValidStreet = function (value) {
    if (/^[A-Za-z0-9\s\W]+$/.test(value)) return true
    return false
  }


  module.exports={isValidEmail,isValidName,isValidPhoneNumber
    ,isValidStrongPassword,isValid,isValidRequestBody,isValidObjectId,
    isValidObject,isValidStreet,isValidNumber}