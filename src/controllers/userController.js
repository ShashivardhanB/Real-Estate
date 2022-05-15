const userModel = require('../models/userModel')
const validator = require('../utils/validator')
const fast2sms = require('fast-two-sms')
const otpModel = require('../models/otpModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const awsSNS = require('../utils/awsSNS')






// const phoneCheck = async function (req, res) {

//     try {

//         const phone = req.body.phone

//         const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone })

//         if (!isPhoneAlreadyUsed) {
//             return res.status(404).send({ status: false, message: "phone number is not used,you can create account and it renders to create account" })
//         } else {

//             return res.status(200).send({ status: true, message: "you have already account login with opt or password and it renders to login account" })

//         }


//     } catch (err) {
//         return res.status(500).send({ status: false, message: err.message })
//     }

// }









const createUser = async function (req, res) {

    try {


        const requestBody = req.body

        let {
            name,
            phone,
            password
        } = requestBody



        if (!validator.isValidPhoneNumber(phone)) {
            return res.status(400).send({
                status: false,
                message: "phone Number  is invalid"
            })
        }
        if (!validator.isValidName(name)) {
            return res.status(400).send({
                status: false,
                message: "name is invalid"
            })
        }


        // if (!validator.isValidEmail(email)) {
        //     return res.status(400).send({
        //         status: false,
        //         message: "email is invalid"
        //     })
        // }

        if (!validator.isValidStrongPassword(password)) {
            return res.send({
                status: false,
                message: "provide the strong password"
            })
        }

        const isUserExist = await userModel.findOne({
            phone: phone
        })

        if (isUserExist) {
            return res.status(400).send({
                status: false,
                message: "Account already exist with this phone number "
            })
        }

        //const isEmailAlreadyUsed = await userModel.findOne({ email: email })
        const salt = bcrypt.genSaltSync(12);
        password = await bcrypt.hash(password, salt);


        const userCreated = await userModel.create(requestBody)


        return res.status(201).send({
            status: true,
            message: " Account created ",
            data: {
                name: name.trim(),
                phone: phone.trim()
            }
        })



    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }

}




const optGenerator = async function (req, res) {

    try {

        const phone = req.body.phone


        let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        let otpLength = 4;

        let otp = '';

        for (let i = 0; i < otpLength; i++) {

            var index = Math.floor(Math.random() * (digits.length));

            otp = otp + digits[index];

        }


        await awsSNS.sendSMSOTP(phone, otp)

        // let options = await fast2sms.sendMessage({
        //     authorization: "SqfThey4gQxFH3i9a8mAuCk0sYzM2onV1NUK5jpBLPOwdEJvcWwux4cY32fVdDz9lkqPKIhtLN87ynM1",
        //     message: `${otp} is your One Time Password(OTP) for phone number verification`,
        //     numbers: [phone]
        // })



        // if (options.return == false) {
        //     return res.status(502).status({
        //         status: false,
        //         message: "there is problem to send the otp "
        //     })
        // }

        const salt = bcrypt.genSaltSync(12);
        let hashedOtp = await bcrypt.hash(otp, salt);

        let data = {
            phone: phone,
            otp: hashedOtp

        }

        await otpModel.create(data)

        return res.status(200).send({
            status: true,
            message: "otp sent successfully",
            data: {
                otp: otp
            }
        })

    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }

}



const accountVerification = async function (req, res) {

    const requestBody = req.body

    const {
        phone,
        otp
    } = requestBody

    if (!validator.isValidRequestBody(requestBody)) {
        return res.status(400).send({
            status: false,
            message: " please provide input"
        })
    }

    if (Object.keys(requestBody).length != 2) {
        return res.status(400).send({
            status: false,
            message: " please provide the otp and phone"
        })
    }
    if (!/^[0-9]+$/.test(otp)) {
        return res.status(400).send({
            status: false,
            message: "otp must be number"
        })
    }

    if (otp.toString().trim().length != 4) {
        return res.status(400).send({
            status: false,
            message: " the length of opt must be 4 digits"
        })
    }

    const isUserExist = await userModel.findOne({
        phone: phone
    })

    if (!isUserExist) {
        return res.status(404).send({
            status: false,
            message: "phone number not registered"
        })
    }

    if (isUserExist.isPhoneverified) {
        return res.status(400).send({
            status: false,
            message: "your account is already verified"
        })
    }

    const isotpExist = await otpModel.findOne({
        phone: phone
    })
    if (!isotpExist) {
        return res.status(400).send({
            status: false,
            message: "opt expried"
        })
    }

    const isOtpCorrect = await bcrypt.compare(otp, isotpExist.otp); //checking that password is correct or not
    if (!isOtpCorrect) {
        return res.status(400).send({
            status: false,
            message: "please enter the valid otp"
        })
    }

    await otpModel.findOneAndDelete({
        phone: phone
    })

    await userModel.findOneAndUpdate({
        phone: phone
    }, {
        isPhoneverified: true
    })

    return res.status(200).send({
        status: true,
        message: "Phone Verified Successfully"
    })

}




const login = async function (req, res) {

    try {

        const requestBody = req.body

        const {
            otp,
            password,
            phone
        } = requestBody

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({
                status: false,
                message: " please provide input"
            })
        }

        if (Object.keys(requestBody).length > 2) {
            return res.status(400).send({
                status: false,
                message: " please provide the otp or password"
            })
        }

        if (otp === undefined && password === undefined) {
            return res.status(400).send({
                status: false,
                message: "please provide otp or password with a valid names"
            })
        }


        const isUserExist = await userModel.findOne({
            phone: phone
        })

        if (!isUserExist) {
            return res.status(404).send({
                status: false,
                message: "user not found "
            })
        }


        if ('otp' in requestBody) {

            const isotpExist = await otpModel.findOne({
                phone: phone
            })
            if (!isotpExist) {
                return res.status(400).send({
                    status: false,
                    message: "opt expried"
                })
            }

            const isOtpCorrect = await bcrypt.compare(otp, isotpExist.otp); //checking that password is correct or not
            if (!isOtpCorrect) {
                return res.status(400).send({
                    status: false,
                    message: "please enter the valid otp"
                })
            }
            await otpModel.findOneAndDelete({
                phone: phone
            })
        }

        if ('password' in requestBody) {
            const isPasswordCorrect = await bcrypt.compare(password, isUserExist.password);
            if (isPasswordCorrect) {
                return res.status(400).send({
                    status: false,
                    message: "Invalid login credentials"
                })
            }
        }


        const token = jwt.sign({
            userId: isUserExist._id,
        }, "NoBroker", {
            expiresIn: "1d"
        })

        res.header("Authorization", "Bearer " + token);
        return res.status(200).send({
            status: true,
            message: "Success",
            data: {
                userId: isUserExist._id,
                token: token
            }
        })

    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }

}












module.exports = {
    createUser,
    optGenerator,
    login,
    accountVerification
}