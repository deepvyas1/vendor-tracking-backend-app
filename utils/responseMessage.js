"use strict";


function ObjectDoesNotExistInDB() {
    this.code = 200,
        this.status = "not_found",
        this.message = "The queried object does not exist in the DB"
}

function ErrorInQueryingDB() {
    this.code = 500,
        this.status = "failure",
        this.message = "Please try after sometime"
}

function GenericSuccessMessage() {
    this.code = 200,
        this.status = "success"
}

function GenericFailureMessage() {
    this.code = 400,
        this.status = "failure"
}

module.exports = {

    ObjectDoesNotExistInDB: ObjectDoesNotExistInDB,

    ErrorInQueryingDB: ErrorInQueryingDB,

    GenericSuccessMessage: GenericSuccessMessage,

    GenericFailureMessage: GenericFailureMessage,

    userDoesNotExist: {
        code: 400,
        status: "failure",
        message: "userName or password is incorrect"
    },

    incorrectPayload: {
        code: 400,
        status: "failure",
        message: "Incorrect Payload"
    },
    restaurantAlreadyExist: {
        code: 400,
        status: "failure",
        message: "Restauarnt Already Exists"
    },

    dishAlreadyExist: {
        code: 400,
        status: "failure",
        message: "Dish Already Exist"
    },

    missingOrBadAuthentication: {
        code: 401,
        status: "failure",
        message: "Missin or Bad Authentication"
    },

    fileTypeNotAllowed: {
        code: 400,
        status: "failure",
        message: "file type not allowed"
    },
    fileUploadFailed: {
        code: 500,
        status: "failure",
        message: "Something went wrong. We are investigating..."
    }

}