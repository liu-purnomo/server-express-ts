"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidStringGenerator = exports.tokenGenerator = void 0;
const uuid_1 = require("uuid");
const tokenGenerator = (length) => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < length; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
};
exports.tokenGenerator = tokenGenerator;
const uuidStringGenerator = () => {
    const uuid = (0, uuid_1.v4)();
    return uuid.toString();
};
exports.uuidStringGenerator = uuidStringGenerator;
//# sourceMappingURL=generator.js.map