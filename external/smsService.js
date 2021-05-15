const http = require("http");
const responseMessage = require("../utils/responseMessage");


module.exports = {

    sendOtp: function(mobileNumber, otp, callback) {
        let response;
        if(!mobileNumber || !otp) {
            console.log("Missing Info ::: mobileNumber: "+mobileNumber+". otp: "+otp);
            response = responseMessage.incorrectPayload;
            return callback(null, response, response.code);
        }
        const options = {
            "method": "GET",
            "hostname": "2factor.in",
            "port": null,
            "path": `/API/V1/${smsAuthKey}/SMS/${mobileNumber}/${otp}`,
            "headers": {
              "content-type": "application/x-www-form-urlencoded"
            }
          };
          
          var req = http.request(options, function (res) {
            var chunks = [];
          
            res.on("data", function (chunk) {
              chunks.push(chunk);
            });
          
            res.on("end", function () {
              var body = Buffer.concat(chunks);
              console.log(body.toString());
              body = body.toString();
              const smsResult = JSON.parse(body);
              if(smsResult.Status === "Success" && smsResult.Details !== null) {
                response = new responseMessage.GenericSuccessMessage();
                return callback(null, response);
              } else {
                response =  new responseMessage.GenericFailureMessage();
                return callback(null, response);
              }
            });
          });
          
          req.end();
    }
}
