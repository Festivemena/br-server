const iso3166 = require("iso-3166-1");

const country = async (country) => {
  const cx = iso3166.whereCountry(country);

  if (cx && cx.alpha2) {
    console.log(cx.alpha2);
    return cx.alpha2;
  
  } else {
    return null;
  }
};

module.exports = country;
