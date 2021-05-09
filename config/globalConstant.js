"use strict";

const environment = process.env.NODE_ENV;

let jwtSecretKey, awsAccessKey, awsSecretKey, cfImageUrl;
if(environment === "production") {
    jwtSecretKey = process.env.PROD_JWT_KEY;
    awsAccessKey = process.env.PROD_S3_ACCESS_KEY;
    awsSecretKey = process.env.PROD_S3_SECRET_KEY;
    cfImageUrl = process.env.PROD_IMAGE_CFURL;
} else if(environment === "development") {
    jwtSecretKey = "vendortracking";
}

global.jwtSecretKey = jwtSecretKey;
global.awsAccessKey = awsAccessKey;
global.awsSecretKey = awsSecretKey;
global.cfImageUrl = cfImageUrl;