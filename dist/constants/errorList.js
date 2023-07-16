"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorList = void 0;
exports.errorList = {
    accessTokenNotFound: {
        code: 401,
        message: "Access token not found",
    },
    usernameIsRequire: {
        code: 400,
        message: "Username is required",
    },
    emailIsRequire: {
        code: 400,
        message: "Email is required",
    },
    passwordIsRequire: {
        code: 400,
        message: "Password is required",
    },
    registerFailed: {
        code: 400,
        message: "Register failed",
    },
    sendEmailFailed: {
        code: 400,
        message: "Send email failed",
    },
    tokenIsRequire: {
        code: 400,
        message: "Token is required",
    },
    userNotFound: {
        code: 404,
        message: "User not found",
    },
    userAlreadyVerified: {
        code: 400,
        message: "User already verified",
    },
    tokenOrEmailIsInvalid: {
        code: 400,
        message: "Token or email is invalid",
    },
    tokenExpired: {
        code: 400,
        message: "Token expired",
    },
    tokenNotExpired: {
        code: 400,
        message: "You can't resend email yet, wait for a few minute",
    },
    generateTokenFailed: {
        code: 400,
        message: "Generate token failed",
    },
    invaidEmailOrPassword: {
        code: 400,
        message: "Invalid email or password",
    },
    invalidToken: {
        code: 400,
        message: "Invalid token",
    },
    userNeedVerify: {
        code: 501,
        message: "User need verify",
    },
    userBanned: {
        code: 401,
        message: "User banned",
    },
    oldPasswordIsRequire: {
        code: 400,
        message: "Old password is required",
    },
    newPasswordIsRequire: {
        code: 400,
        message: "New password is required",
    },
    newPasswordMustBeDifferent: {
        code: 400,
        message: "New password must be different",
    },
    oldPasswordIsInvalid: {
        code: 400,
        message: "Old password is invalid",
    },
    changePasswordFailed: {
        code: 400,
        message: "Change password failed",
    },
    userIsInactive: {
        code: 400,
        message: "User is inactive",
    },
    passwordAlreadyUsed: {
        code: 400,
        message: "You cannot reuse a previously used password",
    },
    updateUserFailed: {
        code: 400,
        message: "Update user failed",
    },
};
//# sourceMappingURL=errorList.js.map