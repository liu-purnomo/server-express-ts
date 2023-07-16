"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            nrrp: {
                type: Sequelize.STRING,
                unique: true,
            },
            username: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            first_name: {
                type: Sequelize.STRING,
            },
            last_name: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.ENUM("MALE", "FEMALE"),
            },
            avatar: {
                type: Sequelize.STRING,
            },
            cover: {
                type: Sequelize.STRING,
            },
            pasfoto: {
                type: Sequelize.STRING,
            },
            token: {
                type: Sequelize.STRING,
            },
            token_expires_at: {
                type: Sequelize.DATE,
            },
            is_admin: {
                type: Sequelize.BOOLEAN,
            },
            is_confirmed: {
                type: Sequelize.BOOLEAN,
            },
            address: {
                type: Sequelize.STRING,
            },
            country: {
                type: Sequelize.STRING,
            },
            province: {
                type: Sequelize.STRING,
            },
            regency: {
                type: Sequelize.STRING,
            },
            district: {
                type: Sequelize.STRING,
            },
            village: {
                type: Sequelize.STRING,
            },
            postal_code: {
                type: Sequelize.STRING,
            },
            latitude: {
                type: Sequelize.STRING,
            },
            longitude: {
                type: Sequelize.STRING,
            },
            password_history: {
                type: Sequelize.ARRAY(Sequelize.STRING),
            },
            last_active: {
                type: Sequelize.DATE,
            },
            ip_address: {
                type: Sequelize.ARRAY(Sequelize.STRING),
            },
            is_verified: {
                type: Sequelize.BOOLEAN,
            },
            status: {
                type: Sequelize.ENUM("PENDING", "ACTIVE", "INACTIVE", "BANNED"),
                defaultValue: "PENDING",
                allowNull: false,
            },
            profile_privacy: {
                type: Sequelize.ARRAY(Sequelize.STRING),
            },
            contact_privacy: {
                type: Sequelize.ENUM("PUBLIC", "PRIVATE"),
                defaultValue: "PUBLIC",
                allowNull: false,
            },
            date_of_birth: {
                type: Sequelize.DATE,
            },
            place_of_birth: {
                type: Sequelize.STRING,
            },
            about: {
                type: Sequelize.TEXT,
            },
            website: {
                type: Sequelize.STRING,
            },
            facebook: {
                type: Sequelize.STRING,
            },
            twitter: {
                type: Sequelize.STRING,
            },
            instagram: {
                type: Sequelize.STRING,
            },
            linkedin: {
                type: Sequelize.STRING,
            },
            youtube: {
                type: Sequelize.STRING,
            },
            whatsapp: {
                type: Sequelize.STRING,
            },
            tiktok: {
                type: Sequelize.STRING,
            },
            threads: {
                type: Sequelize.STRING,
            },
            curriculum_vitae: {
                type: Sequelize.STRING,
            },
            open_to_work: {
                type: Sequelize.BOOLEAN,
            },
            identity_number: {
                type: Sequelize.STRING,
            },
            identity_card: {
                type: Sequelize.STRING,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted_at: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
    },
};
//# sourceMappingURL=20230714162442-create-user.js.map