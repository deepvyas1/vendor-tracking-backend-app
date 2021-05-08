"use strict";

const environement = process.env.NODE_ENV;

let jwtSecretKey;
if(environement === "production") {
    jwtSecretKey = process.env.PROD_JWT_KEY;
} else if(environement === "development") {
    jwtSecretKey = "vendortracking";
}

global.jwtSecretKey = jwtSecretKey;