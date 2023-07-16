"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const excludeList_1 = require("../constants/excludeList");
const helpers_1 = require("../helpers");
const { User } = require("../models");
class UserService {
    static async register(username, email, password) {
        const user = await User.create({
            username,
            email,
            password,
        });
        return user;
    }
    static async findByEmail(email) {
        const user = await User.findOne({
            where: {
                email,
            },
        });
        return user;
    }
    //delete token when expired
    static async deleteToken(email) {
        const user = await User.update({
            token: null,
            token_expires_at: null,
        }, {
            where: {
                email,
            },
        });
        return user;
    }
    static async verify(email) {
        const currentNrrp = await User.max("nrrp");
        const newNrrp = currentNrrp ? Number(currentNrrp) + 1 : 1;
        const nrrp = newNrrp.toString().padStart(8, "0");
        const user = await User.update({
            status: "ACTIVE",
            token: null,
            nrrp,
            token_expires_at: null,
        }, {
            where: {
                email,
            },
        });
        return user;
    }
    static async generateToken(email) {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        const [updatedRows, [updatedData]] = await User.update({
            token: (0, helpers_1.tokenGenerator)(5),
            token_expires_at: expiresAt,
        }, {
            where: {
                email,
            },
            returning: true,
        });
        return { updatedRows, updatedData };
    }
    static async findById(id) {
        const user = await User.findByPk(id);
        return user;
    }
    static async changePassword(id, password) {
        const user = await User.update({
            password,
        }, {
            where: {
                id,
            },
        });
        return user;
    }
    static async savePasswordHistory(id, password_history, password) {
        const updatedRows = await User.update({
            password_history: [...password_history, password],
        }, {
            where: {
                id,
            },
        });
        return updatedRows;
    }
    static async forgotPassword(email) {
        //membuat token dengan uuid
        const token = (0, helpers_1.uuidStringGenerator)();
        const updatedRows = await User.update({
            token,
        }, {
            where: {
                email,
            },
            returning: true,
        });
        return { updatedRows, token };
    }
    static async resetPassword(email, password) {
        const updatedRows = await User.update({
            password,
            token: null,
        }, {
            where: {
                email,
            },
        });
        return updatedRows;
    }
    static async checkPasswordHistory(id, password) {
        const user = await User.findByPk(id);
        const passwordHistory = user.password_history;
        if (!passwordHistory)
            return false;
        let status = false;
        user.password_history.forEach((pass) => {
            if ((0, helpers_1.comparePassword)(password, pass))
                status = true;
            return;
        });
        return status;
    }
    static async profile(id) {
        const user = User.findByPk(id, {
            attributes: {
                exclude: [
                    "password",
                    "password_history",
                    "token",
                    "token_expires_at",
                    "created_at",
                    "updated_at",
                    "deleted_at",
                    "ip_address",
                    "is_admin",
                    "is_confirmed",
                    "status",
                ],
            },
        });
        return user;
    }
    static async detail(id) {
        const user = await User.findByPk(id);
        if (!user)
            return null;
        const exclude = [...user.profile_privacy, ...excludeList_1.excludeList.userProfile];
        const profile = await User.findByPk(id, {
            attributes: {
                exclude: exclude,
            },
        });
        return profile;
    }
    static async update(id, username, first_name, last_name, phone, gender, avatar, cover, pasfoto, address, country, province, regency, district, village, postal_code, latitude, longitude, profile_privacy, contact_privacy, date_of_birth, place_of_birth, about, website, facebook, twitter, instagram, linkedin, youtube, whatsapp, tiktok, threads, curriculum_vitae, open_to_work, identity_number, identity_card) {
        const user = await User.update({
            username,
            first_name,
            last_name,
            phone,
            gender,
            avatar,
            cover,
            pasfoto,
            address,
            country,
            province,
            regency,
            district,
            village,
            postal_code,
            latitude,
            longitude,
            profile_privacy,
            contact_privacy,
            date_of_birth,
            place_of_birth,
            about,
            website,
            facebook,
            twitter,
            instagram,
            linkedin,
            youtube,
            whatsapp,
            tiktok,
            threads,
            curriculum_vitae,
            open_to_work,
            identity_number,
            identity_card,
        }, {
            where: {
                id,
            },
        });
        return user;
    }
    static async index(limit, offset, search, sort, order, province, regency) {
        const whereCondition = {};
        // Menggunakan Op.or untuk mencari data yang mengandung kata yang dicari
        if (search) {
            whereCondition[sequelize_1.Op.or] = [
                { username: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { first_name: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { last_name: { [sequelize_1.Op.iLike]: `%${search}%` } },
            ];
        }
        whereCondition[sequelize_1.Op.and] = [{ status: "ACTIVE" }];
        if (province) {
            whereCondition[sequelize_1.Op.and].push({
                province: { [sequelize_1.Op.like]: `%${province}%` },
            });
        }
        if (regency) {
            whereCondition[sequelize_1.Op.and].push({ regency: { [sequelize_1.Op.like]: `%${regency}%` } });
        }
        let orderCondition = [["created_at", "DESC"]];
        if (sort) {
            orderCondition = [[sort, order]];
        }
        const users = await User.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: orderCondition,
            attributes: [
                "id",
                "username",
                "first_name",
                "last_name",
                "avatar",
                "province",
                "regency",
                "about",
                "website",
                "facebook",
                "twitter",
                "instagram",
                "linkedin",
                "youtube",
                "tiktok",
                "threads",
                "open_to_work",
                "created_at",
            ],
        });
        return users;
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map