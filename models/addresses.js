const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  addresses: {
    ETH: [String],
    BTC: [String],
    USDT: [String],
  },
  // Other properties can be added here
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to add an address to a specific currency array
AddressSchema.methods.addAddress = async function (currency, address) {
  this.addresses[currency].push(address);
  await this.save();
};

AddressSchema.methods.removeAddress = async function (currency, address) {
  const index = this.addresses[currency].indexOf(address);
  if (index !== -1) {
    this.addresses[currency].splice(index, 1);
    await this.save();
  }
};

// Method to add other properties to the model
AddressSchema.methods.addOtherProperty = async function (
  propertyName,
  propertyValue
) {
  this[propertyName] = propertyValue;
  await this.save();
};

// Method to get all addresses
AddressSchema.methods.getAllAddresses = function () {
  return {
    ETH: this.addresses.ETH,
    BTC: this.addresses.BTC,
    USDT: this.addresses.USDT,
  };
};

// Method to get a specific currency's addresses
AddressSchema.methods.getAddressesByCurrency = function (currency) {
  return this.addresses[currency];
};

// This function ensures that only one document of the Address model exists
AddressSchema.statics.findOneOrCreate = async function () {
  let addressInstance = await this.findOne();
  if (!addressInstance) {
    addressInstance = await this.create({});
  }
  return addressInstance;
};

module.exports = mongoose.model("Address", AddressSchema);
