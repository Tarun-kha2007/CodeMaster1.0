const validator = require('validator');

const validate = (data) => {
  const mandatoryField = ['firstName', 'emailId', 'password'];
  const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));
  if (!isAllowed) throw new Error("Some mandatory fields are missing.");

  if (!validator.isEmail(data.emailId)) throw new Error("Invalid Email Address.");

  if (!data.password || data.password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
};

module.exports = validate;