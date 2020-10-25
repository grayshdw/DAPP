const otpGenerator = require("otp-generator");
const crypto = require("crypto");
require('dotenv').config();
const generateOTP={
  createNewOTP:function (createNewOTP) {
    // Generate a 6 digit numeric OTP
    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false
    });
    const ttl = 2 * 60 * 1000; //5 Minutes in miliseconds
    const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
    const data = `${otp}.${expires}`; // phone.otp.expiry_timestamp
    const hash = crypto.createHmac("sha256", process.env.VERIFY_KEY).update(data).digest("hex"); // creating SHA256 hash of the data
    const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
    // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
    console.log(`Your OTP is ${otp}. it will expire in 1 minutes`);
    return otp;
  }
};
module.exports = generateOTP;
