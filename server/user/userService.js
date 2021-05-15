"use strict";

const User = require("./userModel");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const smsService = require("../../external/smsService");
const mailService = require("../../external/mailService");
const responseMessage = require("../../utils/responseMessage");
const mongoose = require("mongoose");

async function generateHashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    return hashedPassword;
}

module.exports = {

    updateUser: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {
            const firstName = body.firstName;
            const lastName = body.lastName;
            const address = body.address;
            const firebaseToken = body.firebaseToken;
            const location = body.location;
            const mobileNumber = body.mobileNumber;
            const userId = body.userId;

            if (!userId) {
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }
            const query = {
                _id: mongoose.Types.ObjectId(userId)
            }
            const updateObject = {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    addressInfo: address,
                    location: location,
                    mobileNumber: mobileNumber,
                    firebaseRegistrationToken: firebaseToken
                }
            };

            const result = await User.findOneAndUpdate(query, updateObject);
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.ErrorInQueryingDB();
                return callback(null, response, response.code);
            }

        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    loginUser: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {
            const email = body.email;
            const otp = body.otp;

            if (!email || !otp) {
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const query = { email: email, otp: otp };
            const updateObject = {
                $set: {
                    otp: null
                }
            }

            const result = await User.findOne(query);
            if (result) {
                result.authenticate((err, data) => {
                    if (err) {
                        response = new responseMessage.GenericFailureMessage();
                        return callback(null, response, response.code);
                    }
                    response = new responseMessage.GenericSuccessMessage();
                    response.data = {
                        token: data,
                        userId: result._id
                    };
                    const deleteOtp = await User.findOneAndUpdate(query, updateObject);
                    return callback(null, response, response.code);
                });
            } else {
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }
        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    sendOtp: async function (body, callback) {
        console.log("Info ::: body recieved: " + JSON.stringify(body));
        let response;
        try {
            const email = body.email;
            const firstName = body.firstName;
            const lastName = body.lastName;

            if (!email || !firstName || !lastName) {
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const otp = parseInt(Math.random() * 100000);
            let emailBody = {};

            const query = { email: email };

            const updateObject = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                otp: otp
            }

            const result = await User.findOneAndUpdate(query, updateObject, { upsert: true, new: true });
            if (result) {
                emailBody.from = mailSender;
                emailBody.to = email;
                emailBody.subject = "Login to Vendor Track App";
                const templatePath = path.resolve(__dirname, "..");
                console.log(path.join(templatePath + "/templates/email/loginEmailTemplate.ejs"));
                const compileTemplate = ejs.compile(fs.readFileSync(path.join(templatePath + "/templates/email/loginEmailTemplate.ejs"), 'utf8'));
                console.log(compileTemplate);
                emailBody.html = compileTemplate({
                    otp: otp
                });
                mailService.sendEmail(emailBody, (err, mailData, statusCode) => {
                    if (!err && statusCode === 200) {
                        response = new responseMessage.GenericSuccessMessage();
                        return callback(null, response, response.code);
                    } else {
                        response = new responseMessage.GenericFailureMessage();
                        return callback(null, response, response.code);
                    }
                });
            }
        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    getUserDetail: async function (req, callback) {
        let response;

        try {
            const userId = req.query.uid;
            if (!userId) {
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const query = { _id: mongoose.Types.ObjectId(userId) };

            const result = await User.findOne(query);
            if (result) {
                response = new responseMessage.GenericSuccessMessage();
                response.data = _.omit(JSON.parse(JSON.stringify(result)), ['_id', '__v', 'otp', 'password']);
                return callback(null, response, response.code);
            } else {
                response = new responseMessage.ErrorInQueryingDB();
                return callback(null, response, response.code);
            }

        } catch (err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    }
}