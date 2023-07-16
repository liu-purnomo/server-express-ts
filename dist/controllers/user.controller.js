"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorList_1 = require("../constants/errorList");
const helpers_1 = require("../helpers");
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    static async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            if (!username)
                throw (0, helpers_1.customError)(errorList_1.errorList.usernameIsRequire);
            if (!email)
                throw (0, helpers_1.customError)(errorList_1.errorList.emailIsRequire);
            if (!password)
                throw (0, helpers_1.customError)(errorList_1.errorList.passwordIsRequire);
            const user = await user_service_1.default.register(username, email, password);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.registerFailed);
            const sendEmail = await (0, helpers_1.sendEmailConfirmation)(user.email, user.token);
            if (!sendEmail)
                throw (0, helpers_1.customError)(errorList_1.errorList.sendEmailFailed);
            res.status(201).json({ status: "success", message: "Register success" });
        }
        catch (error) {
            next(error);
        }
    }
    static async verify(req, res, next) {
        try {
            const { email, token } = req.body;
            if (!email)
                throw (0, helpers_1.customError)(errorList_1.errorList.emailIsRequire);
            if (!token)
                throw (0, helpers_1.customError)(errorList_1.errorList.tokenIsRequire);
            const user = await user_service_1.default.findByEmail(email);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.userNotFound);
            if (user.status !== "PENDING") {
                throw (0, helpers_1.customError)(errorList_1.errorList.userAlreadyVerified);
            }
            if (user.token !== token) {
                throw (0, helpers_1.customError)(errorList_1.errorList.tokenOrEmailIsInvalid);
            }
            if (user.token_expires_at < new Date()) {
                await user_service_1.default.deleteToken(email);
                throw (0, helpers_1.customError)(errorList_1.errorList.tokenExpired);
            }
            await user_service_1.default.verify(email);
            res
                .status(200)
                .json({ status: "success", message: "Verify success, please login" });
        }
        catch (error) {
            next(error);
        }
    }
    static async resend(req, res, next) {
        try {
            const { email } = req.body;
            if (!email)
                throw (0, helpers_1.customError)(errorList_1.errorList.emailIsRequire);
            const user = await user_service_1.default.findByEmail(email);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.userNotFound);
            if (user.status !== "PENDING") {
                throw (0, helpers_1.customError)(errorList_1.errorList.userAlreadyVerified);
            }
            if (user.token_expires_at > new Date()) {
                throw (0, helpers_1.customError)(errorList_1.errorList.tokenNotExpired);
            }
            const { updatedRows, updatedData } = await user_service_1.default.generateToken(email);
            console.log(updatedRows, updatedData);
            if (updatedRows <= 0)
                throw (0, helpers_1.customError)(errorList_1.errorList.generateTokenFailed);
            const sendEmail = await (0, helpers_1.sendEmailConfirmation)(user.email, updatedData.token);
            if (!sendEmail)
                throw (0, helpers_1.customError)(errorList_1.errorList.sendEmailFailed);
            res.status(200).json({ status: "success", message: "New email sent" });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email)
                throw (0, helpers_1.customError)(errorList_1.errorList.emailIsRequire);
            if (!password)
                throw (0, helpers_1.customError)(errorList_1.errorList.passwordIsRequire);
            const user = await user_service_1.default.findByEmail(email);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.userNotFound);
            const isPasswordMatch = (0, helpers_1.comparePassword)(password, user.password);
            if (!isPasswordMatch)
                throw (0, helpers_1.customError)(errorList_1.errorList.invaidEmailOrPassword);
            if (user.status === "BANNED")
                throw (0, helpers_1.customError)(errorList_1.errorList.userBanned);
            const token = (0, helpers_1.encrypt)({ id: user.id });
            res.status(200).json({
                status: "success",
                message: "Login success",
                token: token,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const { id } = req.user;
            if (!oldPassword)
                throw (0, helpers_1.customError)(errorList_1.errorList.oldPasswordIsRequire);
            if (!newPassword)
                throw (0, helpers_1.customError)(errorList_1.errorList.newPasswordIsRequire);
            if (oldPassword === newPassword) {
                throw (0, helpers_1.customError)(errorList_1.errorList.newPasswordMustBeDifferent);
            }
            const user = await user_service_1.default.findById(id);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.userNotFound);
            const isPasswordMatch = (0, helpers_1.comparePassword)(oldPassword, user.password);
            if (!isPasswordMatch)
                throw (0, helpers_1.customError)(errorList_1.errorList.oldPasswordIsInvalid);
            //cek apakah password sudah pernah digunakan
            const isPasswordUsed = await user_service_1.default.checkPasswordHistory(id, newPassword);
            if (isPasswordUsed)
                throw (0, helpers_1.customError)(errorList_1.errorList.passwordAlreadyUsed);
            const updatedUser = await user_service_1.default.changePassword(id, newPassword);
            if (updatedUser <= 0)
                throw (0, helpers_1.customError)(errorList_1.errorList.changePasswordFailed);
            await user_service_1.default.savePasswordHistory(id, user.password_history, user.password);
            res
                .status(200)
                .json({ status: "success", message: "Change password success" });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            if (!email)
                throw (0, helpers_1.customError)(errorList_1.errorList.emailIsRequire);
            const user = await user_service_1.default.findByEmail(email);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.userNotFound);
            const { updatedRows, token } = await user_service_1.default.forgotPassword(email);
            console.log(updatedRows, token, "ini updated data");
            if (updatedRows <= 0)
                throw (0, helpers_1.customError)(errorList_1.errorList.generateTokenFailed);
            const sendEmail = await (0, helpers_1.sendEmailForgotPassword)(user.email, token);
            if (!sendEmail)
                throw (0, helpers_1.customError)(errorList_1.errorList.sendEmailFailed);
            res
                .status(200)
                .json({ status: "success", message: "Link for reset pasword sent" });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { email, token, password } = req.body;
            if (!email)
                throw (0, helpers_1.customError)(errorList_1.errorList.emailIsRequire);
            if (!token)
                throw (0, helpers_1.customError)(errorList_1.errorList.tokenIsRequire);
            if (!password)
                throw (0, helpers_1.customError)(errorList_1.errorList.newPasswordIsRequire);
            const user = await user_service_1.default.findByEmail(email);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.userNotFound);
            if (user.status !== "ACTIVE")
                throw (0, helpers_1.customError)(errorList_1.errorList.userIsInactive);
            if (user.token !== token) {
                throw (0, helpers_1.customError)(errorList_1.errorList.tokenOrEmailIsInvalid);
            }
            const isPasswordUsed = await user_service_1.default.checkPasswordHistory(user.id, password);
            if (isPasswordUsed)
                throw (0, helpers_1.customError)(errorList_1.errorList.passwordAlreadyUsed);
            const { updatedRows } = await user_service_1.default.resetPassword(email, password);
            if (updatedRows <= 0)
                throw (0, helpers_1.customError)(errorList_1.errorList.changePasswordFailed);
            await user_service_1.default.savePasswordHistory(user.id, user.password_history, user.password);
            res
                .status(200)
                .json({ status: "success", message: "Reset password success" });
        }
        catch (error) {
            next(error);
        }
    }
    //membuat static untuk get profile detail berdasarkan user id dari req user
    static async profile(req, res, next) {
        try {
            const { id } = req.user;
            const user = await user_service_1.default.profile(id);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.userNotFound);
            res.status(200).json({
                status: "success",
                message: "Get profile success",
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //membuat static untuk get detail user berdasarkan id dari req params
    static async detail(req, res, next) {
        try {
            const { id } = req.params;
            const user = await user_service_1.default.detail(id);
            if (!user)
                throw (0, helpers_1.customError)(errorList_1.errorList.userNotFound);
            res.status(200).json({
                status: "success",
                message: "Get detail user success",
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    //membuat static untuk update user berdasarkan id dari req user
    static async update(req, res, next) {
        try {
            const { id } = req.user;
            const { username, first_name, last_name, phone, gender, avatar, cover, pasfoto, address, country, province, regency, district, village, postal_code, latitude, longitude, profile_privacy, contact_privacy, date_of_birth, place_of_birth, about, website, facebook, twitter, instagram, linkedin, youtube, whatsapp, tiktok, threads, curriculum_vitae, open_to_work, identity_number, identity_card, } = req.body;
            const user = await user_service_1.default.update(id, username, first_name, last_name, phone, gender, avatar, cover, pasfoto, address, country, province, regency, district, village, postal_code, latitude, longitude, profile_privacy, contact_privacy, date_of_birth, place_of_birth, about, website, facebook, twitter, instagram, linkedin, youtube, whatsapp, tiktok, threads, curriculum_vitae, open_to_work, identity_number, identity_card);
            if (user <= 0)
                throw (0, helpers_1.customError)(errorList_1.errorList.updateUserFailed);
            res.status(200).json({
                status: "success",
                message: "Update user success",
            });
        }
        catch (error) {
            next(error);
        }
    }
    //membuat index user dengan pagination, limit, dan offset, search, sort, dan filter
    static async index(req, res, next) {
        try {
            const { page, size, search, sort, order, province, city } = req.query;
            const limit = size ? Number(size) : 10;
            const offset = page ? (Number(page) - 1) * limit : 0;
            const users = await user_service_1.default.index(limit, offset, search, sort, order, province, city);
            console.log(users, "ini users");
            res.status(200).json({
                status: "success",
                message: "Get users success",
                pageNow: page || 1,
                totalItem: users.count,
                totalPage: Math.ceil(users.count / limit),
                data: users.rows,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map