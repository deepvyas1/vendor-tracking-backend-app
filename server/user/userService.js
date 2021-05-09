"use strict";

const User = require("./userModel");
const bcrypt = require("bcrypt");
const responseMessage = require("../../utils/responseMessage");

async function generateHashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    return hashedPassword;
}

module.exports = {

    registerNewUser: async function(body, callback) {
        console.log("Info ::: body recieved: "+JSON.stringify(body));
        let response;
        try {
            const email = body.email;
            const firstName = body.firstName;
            const lastName = body.lastName;
            const address = body.address;
            const firebaseToken = body.firebaseToken;
            const location = body.location;
            const mobileNumber = body.mobileNumber;
            const password = body.password;

            if(!email && !firstName && !lastName && !mobileNumber && !password) {
                response = responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const hashedPassword = await generateHashPassword(password);

            if(hashedPassword) {
                const query = {
                    email: email
                }
                const updateObject = {
                    firstName: firstName,
                    lastName: lastName,
                    addressInfo: address,
                    location: location,
                    mobileNumber: mobileNumber,
                    password: hashedPassword,
                    firebaseRegistrationToken: firebaseToken
                };
    
                const result = await User.findOneAndUpdate(query, updateObject, {new: true, upsert: true});
                if(result) {
                    response = new responseMessage.GenericSuccessMessage();
                    return callback(null, response, response.code);
                } else {
                    response = new responseMessage.ErrorInQueryingDB();
                    return callback(null, response, response.code);
                }
    
            }
            
        } catch(err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    },

    loginUser: async function(body, callback) {
        console.log("Info ::: body recieved: "+JSON.stringify(body));
        let response;
        try{
            const email = body.email;
            const password = body.password;

            if(!email && !password) {
                response = new responseMessage.incorrectPayload;
                return callback(null, response, response.code);
            }

            const query = {
                email: email
            };

            const result = await User.findOne(query);
            if(result) {
                result.authenticate(password, (err, data) => {
                    if(err) {
                        response = new responseMessage.GenericFailureMessage();
                        return callback(null, response, response.code);
                    }
                    response = new responseMessage.GenericSuccessMessage();
                    response.data = data;
                    return callback(null, response, response.code);
                });
            }
        } catch(err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    }
}