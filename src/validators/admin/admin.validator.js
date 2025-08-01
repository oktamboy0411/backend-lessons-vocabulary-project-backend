const { body, query, param } = require("express-validator");

class AdminValidator {
  static signUp = () => [
    body("name", "Name is required.").notEmpty(),
    body("name", "Name must be a string.").isString(),
    body("phone", "Phone is required.").notEmpty(),
    body("phone", "Invalid phone number.").isMobilePhone("any", {
      strictMode: true,
    }),
    body("password", "Password is required.").notEmpty(),
    body(
      "password",
      "Password must be strong. It should be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol."
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
    body("reg_key", "Registration key is required.").notEmpty(),
    body("reg_key", "Registration key must be a string.").isString(),
  ];

  static login = () => [
    body("phone", "Phone is required.").notEmpty(),
    body("phone", "Invalid phone number.").isMobilePhone("any", {
      strictMode: true,
    }),
    body("password", "Password is required.").notEmpty(),
    body(
      "password",
      "Password must be strong. It should be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol."
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  ];
}

module.exports = { AdminValidator };
