import { Op } from "sequelize";
import { excludeList } from "../constants/excludeList";
import {
  comparePassword,
  tokenGenerator,
  uuidStringGenerator,
} from "../helpers";

const { User } = require("../models");

type User = typeof User;

class UserService {
  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<typeof User | null> {
    const user = await User.create({
      username,
      email,
      password,
    });
    return user;
  }

  static async findByEmail(email: string): Promise<typeof User | null> {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  //delete token when expired
  static async deleteToken(email: string): Promise<typeof User | null> {
    const user = await User.update(
      {
        token: null,
        token_expires_at: null,
      },
      {
        where: {
          email,
        },
      }
    );
    return user;
  }

  static async verify(email: string): Promise<typeof User | null> {
    const currentNrrp = await User.max("nrrp");
    const newNrrp = currentNrrp ? Number(currentNrrp) + 1 : 1;
    const nrrp = newNrrp.toString().padStart(8, "0");

    const user = await User.update(
      {
        status: "ACTIVE",
        token: null,
        nrrp,
        token_expires_at: null,
      },
      {
        where: {
          email,
        },
      }
    );
    return user;
  }

  static async generateToken(
    email: string
  ): Promise<{ updatedRows: number; updatedData: User | null }> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    const [updatedRows, [updatedData]] = await User.update(
      {
        token: tokenGenerator(5),
        token_expires_at: expiresAt,
      },
      {
        where: {
          email,
        },
        returning: true,
      }
    );

    return { updatedRows, updatedData };
  }

  static async findById(id: string): Promise<typeof User | null> {
    const user = await User.findByPk(id);
    return user;
  }

  static async changePassword(
    id: string,
    password: string
  ): Promise<typeof User | null> {
    const user = await User.update(
      {
        password,
      },
      {
        where: {
          id,
        },
      }
    );
    return user;
  }

  static async savePasswordHistory(
    id: string,
    password_history: string[],
    password: string
  ): Promise<{ updatedRows: number }> {
    const updatedRows = await User.update(
      {
        password_history: [...password_history, password],
      },
      {
        where: {
          id,
        },
      }
    );
    return updatedRows;
  }

  static async forgotPassword(
    email: string
  ): Promise<{ updatedRows: number; token: string | null }> {
    //membuat token dengan uuid
    const token = uuidStringGenerator();
    const updatedRows = await User.update(
      {
        token,
      },
      {
        where: {
          email,
        },
        returning: true,
      }
    );

    return { updatedRows, token };
  }

  static async resetPassword(
    email: string,
    password: string
  ): Promise<{ updatedRows: number }> {
    const updatedRows = await User.update(
      {
        password,
        token: null,
      },
      {
        where: {
          email,
        },
      }
    );
    return updatedRows;
  }

  static async checkPasswordHistory(
    id: string,
    password: string
  ): Promise<boolean> {
    const user = await User.findByPk(id);
    const passwordHistory = user.password_history;
    if (!passwordHistory) return false;

    let status = false;

    user.password_history.forEach((pass: string) => {
      if (comparePassword(password, pass)) status = true;
      return;
    });

    return status;
  }

  static async profile(id: string): Promise<typeof User | null> {
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

  static async detail(id: string): Promise<typeof User | null> {
    const user = await User.findByPk(id);

    if (!user) return null;

    const exclude = [...user.profile_privacy, ...excludeList.userProfile];

    const profile = await User.findByPk(id, {
      attributes: {
        exclude: exclude,
      },
    });

    return profile;
  }

  static async update(
    id: string,
    username: string,
    first_name: string,
    last_name: string,
    phone: string,
    gender: string,
    avatar: string,
    cover: string,
    pasfoto: string,
    address: string,
    country: string,
    province: string,
    regency: string,
    district: string,
    village: string,
    postal_code: string,
    latitude: string,
    longitude: string,
    profile_privacy: string[],
    contact_privacy: string,
    date_of_birth: Date,
    place_of_birth: string,
    about: string,
    website: string,
    facebook: string,
    twitter: string,
    instagram: string,
    linkedin: string,
    youtube: string,
    whatsapp: string,
    tiktok: string,
    threads: string,
    curriculum_vitae: string,
    open_to_work: boolean,
    identity_number: string,
    identity_card: string
  ): Promise<number> {
    const user = await User.update(
      {
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
      },
      {
        where: {
          id,
        },
      }
    );

    return user;
  }

  static async index(
    limit: number,
    offset: number,
    search: string,
    sort: string,
    order: string,
    province: string,
    regency: string
  ): Promise<{ count: number; rows: User[] }> {
    const whereCondition: any = {};

    // Menggunakan Op.or untuk mencari data yang mengandung kata yang dicari
    if (search) {
      whereCondition[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    whereCondition[Op.and] = [{ status: "ACTIVE" }];

    if (province) {
      whereCondition[Op.and].push({
        province: { [Op.like]: `%${province}%` },
      });
    }

    if (regency) {
      whereCondition[Op.and].push({ regency: { [Op.like]: `%${regency}%` } });
    }

    let orderCondition: any = [["created_at", "DESC"]];

    if (sort) {
      orderCondition = [[sort, order]];
    }

    const users = await User.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: orderCondition,
      attributes: [
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

export default UserService;
