"use strict";

const environment = process.env.NODE_ENV;

let jwtSecretKey, awsAccessKey, awsSecretKey;
if(environment === "production") {
    jwtSecretKey = process.env.PROD_JWT_KEY;
    awsAccessKey = process.env.PROD_S3_ACCESS_KEY;
    awsSecretKey = process.env.PROD_S3_SECRET_KEY;
} else if(environment === "development") {
    jwtSecretKey = "vendortracking";
}

global.jwtSecretKey = jwtSecretKey;
global.awsAccessKey = awsAccessKey;
global.awsSecretKey = awsSecretKey;