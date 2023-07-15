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
    const user = User.create({
      username,
      email,
      password,
    });
    return user;
  }

  static async findByEmail(email: string): Promise<typeof User | null> {
    const user = User.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  //delete token when expired
  static async deleteToken(email: string): Promise<typeof User | null> {
    const user = User.update(
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

    const user = User.update(
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
    const user = User.findByPk(id);
    return user;
  }

  static async changePassword(
    id: string,
    password: string
  ): Promise<typeof User | null> {
    const user = User.update(
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
    const updatedRows = User.update(
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
    const updatedRows = User.update(
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
    const updatedRows = User.update(
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
}

export default UserService;
