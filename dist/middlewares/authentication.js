"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const errorList_1 = require("../constants/errorList");
const helpers_1 = require("../helpers");
const { User } = require("../models");
const BEARER = process.env.BEARER_KEY;
const isLoggedIn = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization)
            throw (0, helpers_1.customError)(errorList_1.errorList.invalidToken);
        const shield = authorization.split(" ")[0];
        if (shield !== BEARER)
            throw (0, helpers_1.customError)(errorList_1.errorList.invalidToken);
        const token = authorization.split(" ")[1];
        if (!token)
            throw (0, helpers_1.customError)(errorList_1.errorList.invalidToken);
        const payload = (0, helpers_1.decrypt)(token);
        const user = await User.findByPk(payload.id);
        if (!user)
            throw (0, helpers_1.customError)(errorList_1.errorList.invalidToken);
        if (user.status === "PENDING")
            throw (0, helpers_1.customError)(errorList_1.errorList.userNeedVerify);
        req.user = {
            id: user.id,
            status: user.status,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isLoggedIn = isLoggedIn;
//# sourceMappingURL=authentication.js.map