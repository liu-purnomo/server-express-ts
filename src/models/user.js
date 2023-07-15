"use strict";
const { Model } = require("sequelize");
const { hashPassword, tokenGenerator } = require("../helpers");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      nrrp: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "NRRP already exists",
        },
      },
      username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Username already exists",
        },
        allowNull: false,
        validate: {
          notNull: {
            msg: "Username is required",
          },
          notEmpty: {
            msg: "Username is required",
          },
          len: {
            args: [5, 30],
            msg: "Username minimum 5 characters and maximum 30 characters",
          },
          //tidak boleh huruf besar dan tidak boleh ada spasinya
          is: {
            args: /^[a-z0-9\_\-]+$/i,
            msg: "Username must only contain alphanumeric, underscore, and dash",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email is required",
          },
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Email must be valid",
          },
        },
        unique: {
          args: true,
          msg: "Email already exists",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          notEmpty: {
            msg: "Password is required",
          },
          min: {
            args: 6,
            msg: "Password minimum 6 characters",
          },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z0-9\S]{6,}$/i,
            msg: "Password must contain lowercase, uppercase, number, and symbol",
          },
          notIn: {
            args: [
              "password",
              "pass",
              "Pass",
              "Password",
              "PASSWORD",
              "123456",
              "654321",
              "qwerty",
              "asdfgh",
              "zxcvbn",
            ],
            msg: "Password is too weak",
          },
        },
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: {
        type: DataTypes.ENUM,
        values: ["MALE", "FEMALE"],
      },
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      pasfoto: DataTypes.STRING,
      token: DataTypes.STRING,
      token_expires_at: DataTypes.DATE,
      is_admin: DataTypes.BOOLEAN,
      is_confirmed: DataTypes.BOOLEAN,
      address: DataTypes.STRING,
      country: DataTypes.STRING,
      province: DataTypes.STRING,
      regency: DataTypes.STRING,
      district: DataTypes.STRING,
      village: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      password_history: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      last_active: DataTypes.DATE,
      ip_address: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      is_verified: DataTypes.BOOLEAN,
      status: {
        type: DataTypes.ENUM,
        values: ["PENDING", "ACTIVE", "INACTIVE", "BANNED"],
      },
      profile_privacy: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      contact_privacy: {
        type: DataTypes.ENUM,
        values: ["PUBLIC", "PRIVATE"],
      },
      date_of_birth: DataTypes.DATE,
      place_of_birth: DataTypes.STRING,
      about: DataTypes.TEXT,
      website: DataTypes.STRING,
      facebook: DataTypes.STRING,
      twitter: DataTypes.STRING,
      instagram: DataTypes.STRING,
      linkedin: DataTypes.STRING,
      youtube: DataTypes.STRING,
      whatsapp: DataTypes.STRING,
      tiktok: DataTypes.STRING,
      threads: DataTypes.STRING,
      curriculum_vitae: DataTypes.STRING,
      open_to_work: DataTypes.BOOLEAN,
      identity_number: DataTypes.STRING,
      identity_card: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
      deletedAt: "deleted_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.beforeCreate((user) => {
    user.status = "PENDING";
    user.is_confirmed = false;
    user.is_admin = false;
    user.is_verified = false;
    user.profile_privacy = "PUBLIC";
    user.contact_privacy = "PUBLIC";
    user.password = hashPassword(user.password);

    user.token = tokenGenerator(5);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Set expiration to 5 minutes from now
    user.token_expires_at = expiresAt;
  });

  User.beforeUpdate((user) => {
    user.password = hashPassword(user.password);
  });
  return User;
};
