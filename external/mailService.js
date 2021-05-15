"use strict";

const responseMessage = require("../utils/responseMessage");

module.exports = {

    sendEmail: async function(emailBody, callback) {
        let response;
        try {
            const info = await smtpTransport.sendMail(emailBody);
            if(info !== null) {
                console.log("Info ::: Mail has been sent successfully: ", emailBody.to);
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response, response.code);
            } else {
                console.log("Error ::: while sending email to: ", emailBody.to);
                response = new responseMessage.GenericFailureMessage();
                return callback(null, response, response.code);
            }
        } catch(err) {
            console.log(`Error ::: error ${err.message} stack ${err.stack}`);
            response = new responseMessage.ErrorInQueryingDB();
            return callback(null, response, response.code);
        }
    }
}