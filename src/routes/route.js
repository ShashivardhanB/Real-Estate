const express =  require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const geoCoderAddProp= require('../middleWare/geoCoderAddProp')
const geoCoderSearch= require('../middleWare/geoCoderSearch')
const residentialRentController = require('../controllers/residentialRentController')
const residentialResaleController = require('../controllers/residentialResaleController')
const authMiddleWare = require('../middleWare/auth')
const residentalRentSearchController = require('../controllers/residentialRentSearchController')
const residentalResaleSearchController = require('../controllers/residentialResaleSearchController')
const commercialRentController =  require('../controllers/commercialRentController')
const commercailResaleController = require('../controllers/commercialResaleController')
const commercailRentSearchController = require('../controllers/commercialRentSearchController')
const commercailResaleSearchController = require('../controllers/commericalResaleSearchController')

router.get('/test', () =>{
    console.log("tested")
})


/**************************************Users APIs*********************************************** */
router.post('/register', userController.createUser)
router.post('/otp-generator', userController.optGenerator)
router.post('/account-verification',userController.accountVerification)
router.post('/login',userController.login)


/*****************************************residential APIs***************************************** */
router.post('/user/:userId/residential-rent',authMiddleWare.auth, geoCoderAddProp.geocodeAdd,residentialRentController.residentialRentCreate)
router.post('/user/:userId/residential-resale',authMiddleWare.auth, geoCoderAddProp.geocodeAdd,residentialResaleController.residentialResaleCreate)
router.get('/user/:userId/residential-rent', authMiddleWare.auth,residentialRentController.getPropertiesRentRes)
router.get('/user/:userId/residential-resale',authMiddleWare.auth,residentialResaleController.getPropertiesResaleRes)
router.put('/user/:userId/residential-rent', authMiddleWare.auth,residentialRentController.residentialRentStatus)
router.put('/user/:userId/residential-resale',authMiddleWare.auth,residentialResaleController.residentialResaleStatus)


/************************************* redisential Search APIs ***********************************************/
router.get('/:city/residental-rent',geoCoderSearch.geocode,residentalRentSearchController.residentalRentSearch)
router.get('/:city/residental-resale',geoCoderSearch.geocode,residentalResaleSearchController.residentalResaleSearch)
router.post('/user/:userId/residential-rent-interest/:propertyId',authMiddleWare.auth, residentalRentSearchController.residentalRentinterest)
router.post('/user/:userId/residential-resale-interest/:propertyId',authMiddleWare.auth, residentalResaleSearchController.residentalResaleinterest)

/************************************Commercial APIs ********************************************************************/
router.post('/user/:userId/commercial-rent',authMiddleWare.auth, geoCoderAddProp.geocodeAdd,commercialRentController.commercialRentCreate)
router.post('/user/:userId/commercial-resale',authMiddleWare.auth, geoCoderAddProp.geocodeAdd,commercailResaleController.commercialResaleCreate)
router.get('/user/:userId/commercial-rent', authMiddleWare.auth,commercialRentController.getPropertiesRentCom)
router.get('/user/:userId/commercial-resale',authMiddleWare.auth,commercailResaleController.getPropertiesResaleCom)
router.put('/user/:userId/commercial-rent', authMiddleWare.auth,commercialRentController.commercialRentStatus)
router.put('/user/:userId/commercial-resale',authMiddleWare.auth,commercailResaleController.commercialResaleStatus)

/************************************* Commercial Search APIs ***********************************************/
router.get('/:city/commercial-rent',geoCoderSearch.geocode,commercailRentSearchController.commercialRentSearch)
router.get('/:city/commercial-resale',geoCoderSearch.geocode,commercailResaleSearchController.commericalResaleSearch)
router.post('/user/:userId/commercial--rent-interest/:propertyId',authMiddleWare.auth, commercailRentSearchController.commercialRentinterest)
router.post('/user/:userId/commercial--resale-interest/:propertyId',authMiddleWare.auth, commercailResaleSearchController.commercialResaleinterest)


module.exports = router
