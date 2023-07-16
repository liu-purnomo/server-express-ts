"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const salt = bcryptjs_1.default.genSaltSync(10);
const hashPassword = (password) => {
    return bcryptjs_1.default.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => {
    return bcryptjs_1.default.compareSync(password, hashedPassword);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=bcrypt.js.map