## Project - RealEstate Website Backend with MongoDB,Express.js,Node.js,AWS S3,AWS SNS

## Description
- This is the RealEstate Website Backend project ,where the users  can create an account and they need to verify there account by using otp that sent to there mobile number , user can post the property (like ads) if the user is want to sale or rent a property , users can show  interest to a property and the interested users  contacts will sent to the owner
## FEATURES
### Residental Rent or Residental Resale
- 1.User can post there Residental Rent or Residental Resale property 
- 2.User can see the Residental Rent or Residental Resale property 
- 3.User can change there status of property
### Commerical Rent or Commerical Resale
- 1.User can post there Commerical Rent or Commerical Resale property 
- 2.User can see the Commerical Rent or Commerical Resale property 
- 3.User can change there status of property
### Residental Rent Search or Residental Resale Search
- 1.User can search the Residental Rent  or Residental Resale 
- 2.User can show interest to a Residental Rent  or Residental Resale
- 3.Property owner will get the contacts details of interested users
### Commerical Rent Search or Commerical Resale Search
- 1.User can search the Commerical Rent  or Commerical Resale 
- 2.User can show interest to a Commerical Rent  or Commerical Resale
- 3.Property owner will get the contacts details of interested users

## USER APIs
### POST /register
- Registering  to the RealEstate Website
### GET /otp-generator
- Generatoring the OTP for account-verification or login
- OTP will delete after 5 Min from our database
### POST /account-verification
- User must verify to access  the protected resources
### POST /login
- User can login through phone and password or OTP

## RESIDENTIAL POST ADS APIs
### Post /user/:userId/residential-rent (Authentication and Authorization required)
- User can post the ad of property i.e residential-rent
### GET /user/:userId/residential-rent (Authentication and Authorization required)
- User can see there own  property 
- User should give the UserId in params
### PUT /user/:userId/residential-rent (Authentication and Authorization required)
- User can change there status of property i.e availablely ,Active ,Inactive
- User Should give the propertyId and status in Body
### Post /user/:userId/residential-resale (Authentication and Authorization required)
- User can post the ADs of property i.e residential-rent
- User should give the information in body 
### GET /user/:userId/residential-resale (Authentication and Authorization required)
- User can see there own  property
- User should give the UserId in params
### PUT /user/:userId/residential-resale (Authentication and Authorization required)
- User can change there status of property i.e availablely ,Active ,Inactive
- User Should give the propertyId and status in Body

## RESIDENTIAL SEARCH APIs 
### GET '/:city/residental-rent'
- Search a  residental property for rent ,by taking the input for filter i.e city,locality,Apartmet type,BHK type
### GET '/:city/residental-resale'
- Search a  residental property for resale ,by taking the input for filter i.e city,locality,Apartmet type,BHK type
### Post /user/:userId/residential-rent-interest/:propertyId (Authentication and Authorization required)
- User can show the interest to a property and user details we sent to property owner through SMS(mobile)
- UserId and propertyId in params
### Post /user/:userId/residential-resale-interest/:propertyId (Authentication and Authorization required)
- User can show the interest to a property and user details we sent to property owner through SMS(mobile)
- UserId and propertyId in params

## COMMERCIAL POST ADS APIs
### Post /user/:userId/commercial-rent (Authentication and Authorization required)
- User can post the ADs of property i.e commercial-rent
- User should give the information in body 
### GET /user/:userId/commercial-rent (Authentication and Authorization required)
- User can see there own  property 
- User should give the UserId in params
### PUT /user/:userId/commercial-rent (Authentication and Authorization required)
- User can change there status of property i.e availablely ,Active ,Inactive
- User Should give the propertyId and status in Body
### Post /user/:userId/commercial-resale (Authentication and Authorization required)
- User can post the ad of property i.e residential-rent
- User should give the information in body 
### GET /user/:userId/commercial-resale (Authentication and Authorization required)
- User can see there own  property
- User should give the UserId in params
### PUT /user/:userId/commercial-resale (Authentication and Authorization required)
- User can change there status of property i.e availablely ,Active ,Inactive
- User Should give the propertyId and status in Body

## COMMERCIAL SEARCH APIs 
### GET '/:city/commercial-rent'
- Search a  residental property for rent ,by taking the input for filter i.e city,locality,Apartmet type,BHK type
### GET '/:city/commercial-resale'
- Search a  residental property for resale ,by taking the input for filter i.e city,locality,Apartmet type,BHK type
### Post /user/:userId/commercial-rent-interest/:propertyId (Authentication and Authorization required)
- User can show the interest to a property and user details we sent to property owner through SMS(mobile)
- UserId and propertyId in params
### Post /user/:userId/commercial-resale-interest/:propertyId (Authentication and Authorization required)
- User can show the interest to a property and user details we sent to property owner through SMS(mobile)
- UserId and propertyId in params