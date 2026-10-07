const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

exports.hashPassword = (plainPassword) => {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

exports.comparePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};
