"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRETKEY = process.env.JWT_KEY || "ini tidak aman";
const encrypt = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRETKEY);
};
exports.encrypt = encrypt;
const decrypt = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRETKEY);
};
exports.decrypt = decrypt;
//# sourceMappingURL=jwt.js.map