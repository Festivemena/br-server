const libphonenumber = require("google-libphonenumber");
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

function isValidPhoneNumber(phoneNumber, regionCode) {
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(
      phoneNumber,
      regionCode
    );
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (error) {
    return false;
  }
}

// // // Example usage:
// const phoneNumber = "07041712291";
// const regionCode = "NG";
// console.log(isValidPhoneNumber(phoneNumber, regionCode)); // Outputs true or false

module.exports = isValidPhoneNumber