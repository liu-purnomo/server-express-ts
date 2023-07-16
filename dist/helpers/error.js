"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customError = void 0;
const customError = (errName) => {
    const error = {
        name: "customError",
        code: errName.code,
        message: errName.message,
    };
    return error;
};
exports.customError = customError;
//# sourceMappingURL=error.js.map