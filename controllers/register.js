const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncWrapper = require("../middleware/async");
const countryShortName = require("../utils/get-country-short-name");
const phoneNumberValidator = require("../utils/validate-phone-number");
const { CustomAPIError } = require("../errors/custom-error");

const register = asyncWrapper(async (req, res) => {
  const {
    name: fullName,
    email,
    password,
    phone,
    country,
    currency,
  } = req.body;
  const { ref } = req.query;

  const newUser = await User.findOne({ accountEmail: email }).exec();
  const newUserPhone = await User.findOne({
    accountPhoneNumber: phone,
  }).exec();

  if (newUser) {
    throw new CustomAPIError(
      "Email already exists, proceed to login",
      400
    );
  }

  if (newUserPhone) {
    throw new CustomAPIError(
      "Phone number already exists, try another",
      400
    );
  }

  const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (!fullNameRegex.test(fullName) || fullName.length > 35) {
    throw new CustomAPIError(
      "Invalid full name. It must be at least two names, not exceed 35 characters, and contain only letters.",
      400
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

  if (!emailRegex.test(email)) {
    throw new CustomAPIError("Invalid email format", 400);
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new CustomAPIError(
      "Password must be at least 8 characters and contain at least one letter, one number, and can include special characters",
      400
    );
  }

  const shortName = await countryShortName(country);

  if (!shortName) {
    throw new CustomAPIError("Can't Validate Country", 400);
  }

  const isValidPhoneNumber = phoneNumberValidator(phone, shortName);
  if (!isValidPhoneNumber) {
    throw new CustomAPIError(
      "Invalid Phone Number or Phone Number format",
      400
    );
  }
  const refID = await generateUniqueReferralId();
  console.log(refID);

  if (ref && !Number.isNaN(Number(ref))) {
    const referrer = await User.findOne({ refID: Number(ref) });
    console.log(referrer);
    if (referrer) {
      referrer.userReferrals.push(refID);
    }

    referrer.save();
  }

  let user = new User({
    accountEmail: email,
    fullName,
    accountPassword: password,
    accountCurrency: currency,
    accountPhoneNumber: phone,
    accountCountry: country,
    accountCurrency: String(currency).toUpperCase(),
    refID,
  });

  user = await user.save();

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  res.status(201).json({ token, user });
});

async function generateUniqueReferralId() {
  while (true) {
    const referralId = generateRandomReferralId();
    const user = await User.findOne({ referralId });
    if (!user) {
      return referralId;
    }
  }
}

function generateRandomReferralId() {
  const min = 10000;
  const max = 99999;
  return Number(Math.floor(Math.random() * (max - min + 1)) + min);
}

module.exports = {
  register,
};
