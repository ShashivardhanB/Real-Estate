const aws = require('aws-sdk')



// aws.config.update({
//     accessKeyId: "AKIAQZWB3E2LVXB5MOWL",
//     secretAccessKey: "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",
//     region: "ap-south-1"
// })


const sendSMSOTP = async function (phone, otp) {
    return new Promise(function (resolve, reject) {
        aws.config.update({
            accessKeyId: "AKIAQZWB3E2LVXB5MOWL",
            secretAccessKey: "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",
            region: "ap-south-1"
        })
        var sns = new aws.SNS()


        sns.publish({
            Message:  `${otp} is your One Time Password(OTP) for phone number verification for realEstate website`,
            Subject: "opt verification",
            PhoneNumber: `+91 ${phone}`,
        }, (err, result) => {
            if (err) return reject({ error: err })
            console.log(" SMS sent successfully ")
            return resolve(result)

        })


    })
}


const sendSMSForOwner = async function (phone,name,intersetedPhone,propertyType,city,locality) {
    return new Promise(function (resolve, reject) {
        aws.config.update({
            accessKeyId: "AKIAQZWB3E2LVXB5MOWL",
            secretAccessKey: "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",
            region: "ap-south-1"
        })
        var sns = new aws.SNS()


        sns.publish({
            Message:  `Hi User , ${name} is interested in your ${propertyType} property in ${locality},${city}, you can connect with ${intersetedPhone} Mobile Number`,
            Subject: " Regarding Your property in RealEstate Website",
            PhoneNumber: `+91 ${phone}`,
        }, (err, result) => {
            if (err) return reject({ error: err })
            console.log(" SMS sent successfully ")
            return resolve(result)

        })


    })
}




module.exports={sendSMSOTP,sendSMSForOwner}