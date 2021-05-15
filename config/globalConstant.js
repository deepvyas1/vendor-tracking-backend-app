"use strict";

const mailer = require("nodemailer");
const lodash = require("lodash");
const environment = process.env.NODE_ENV;

let jwtSecretKey, awsAccessKey, awsSecretKey, cfImageUrl, smsAuthKey;

let smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "",
        pass: ""
    }
}
if(environment === "production") {
    jwtSecretKey = process.env.PROD_JWT_KEY;
    awsAccessKey = process.env.PROD_S3_ACCESS_KEY;
    awsSecretKey = process.env.PROD_S3_SECRET_KEY;
    cfImageUrl = process.env.PROD_IMAGE_CFURL;
    smtpConfig.auth.user = process.env.PROD_EMAIL_USER,
    smtpConfig.auth.pass = process.env.PROD_EMAIL_PASS
    smsAuthKey = process.env.PROD_SMS_AUTH_KEY;
} else if(environment === "development") {
    jwtSecretKey = "vendortracking";
}

const smtpTransport = mailer.createTransport(smtpConfig);

global.jwtSecretKey = jwtSecretKey;
global.awsAccessKey = awsAccessKey;
global.awsSecretKey = awsSecretKey;
global.cfImageUrl = cfImageUrl;
global.smtpTransport = smtpTransport;
global.smsAuthKey = smsAuthKey;
global.mailSender = smtpConfig.auth.user;
global._ = lodash;