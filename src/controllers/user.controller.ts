import { NextFunction, Request, Response } from "express";
import { errorList } from "../constants/errorList";
import {
  comparePassword,
  customError,
  encrypt,
  sendEmailConfirmation,
  sendEmailForgotPassword,
} from "../helpers";
import UserService from "../services/user.service";

class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      if (!username) throw customError(errorList.usernameIsRequire);
      if (!email) throw customError(errorList.emailIsRequire);
      if (!password) throw customError(errorList.passwordIsRequire);

      const user = await UserService.register(username, email, password);

      if (!user) throw customError(errorList.registerFailed);

      const sendEmail = await sendEmailConfirmation(user.email, user.token);

      if (!sendEmail) throw customError(errorList.sendEmailFailed);

      res.status(201).json({ status: "success", message: "Register success" });
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, token } = req.body;
      if (!email) throw customError(errorList.emailIsRequire);
      if (!token) throw customError(errorList.tokenIsRequire);

      const user = await UserService.findByEmail(email as string);

      if (!user) throw customError(errorList.userNotFound);

      if (user.status !== "PENDING") {
        throw customError(errorList.userAlreadyVerified);
      }

      if (user.token !== token) {
        throw customError(errorList.tokenOrEmailIsInvalid);
      }

      if (user.token_expires_at < new Date()) {
        await UserService.deleteToken(email as string);
        throw customError(errorList.tokenExpired);
      }

      await UserService.verify(email as string);

      res
        .status(200)
        .json({ status: "success", message: "Verify success, please login" });
    } catch (error) {
      next(error);
    }
  }

  static async resend(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) throw customError(errorList.emailIsRequire);

      const user = await UserService.findByEmail(email as string);

      if (!user) throw customError(errorList.userNotFound);

      if (user.status !== "PENDING") {
        throw customError(errorList.userAlreadyVerified);
      }

      if (user.token_expires_at > new Date()) {
        throw customError(errorList.tokenNotExpired);
      }

      const { updatedRows, updatedData } = await UserService.generateToken(
        email as string
      );

      if (updatedRows <= 0) throw customError(errorList.generateTokenFailed);

      const sendEmail = await sendEmailConfirmation(
        user.email,
        updatedData.token
      );

      if (!sendEmail) throw customError(errorList.sendEmailFailed);

      res.status(200).json({ status: "success", message: "New email sent" });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email) throw customError(errorList.emailIsRequire);
      if (!password) throw customError(errorList.passwordIsRequire);

      const user = await UserService.findByEmail(email as string);

      if (!user) throw customError(errorList.invaidEmailOrPassword);

      const isPasswordMatch = comparePassword(password, user.password);

      if (!isPasswordMatch) throw customError(errorList.invaidEmailOrPassword);
      if (user.status === "BANNED") throw customError(errorList.userBanned);

      const token = encrypt({ id: user.id });

      res.status(200).json({
        status: "success",
        message: "Login success",
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword } = req.body;
      const { id } = (req as any).user;
      if (!oldPassword) throw customError(errorList.oldPasswordIsRequire);
      if (!newPassword) throw customError(errorList.newPasswordIsRequire);
      if (oldPassword === newPassword) {
        throw customError(errorList.newPasswordMustBeDifferent);
      }

      const user = await UserService.findById(id as string);

      if (!user) throw customError(errorList.userNotFound);

      const isPasswordMatch = comparePassword(oldPassword, user.password);

      if (!isPasswordMatch) throw customError(errorList.oldPasswordIsInvalid);

      //cek apakah password sudah pernah digunakan
      const isPasswordUsed = await UserService.checkPasswordHistory(
        id as string,
        newPassword
      );

      if (isPasswordUsed) throw customError(errorList.passwordAlreadyUsed);

      const updatedUser = await UserService.changePassword(
        id as string,
        newPassword
      );

      if (updatedUser <= 0) throw customError(errorList.changePasswordFailed);

      await UserService.savePasswordHistory(
        id as string,
        user.password_history,
        user.password
      );

      res
        .status(200)
        .json({ status: "success", message: "Change password success" });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) throw customError(errorList.emailIsRequire);

      const user = await UserService.findByEmail(email as string);

      if (!user) throw customError(errorList.userNotFound);

      const { updatedRows, token } = await UserService.forgotPassword(
        email as string
      );

      if (updatedRows <= 0) throw customError(errorList.generateTokenFailed);

      const sendEmail = await sendEmailForgotPassword(
        user.email,
        token as string
      );

      if (!sendEmail) throw customError(errorList.sendEmailFailed);

      res
        .status(200)
        .json({ status: "success", message: "Link for reset pasword sent" });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, token, password } = req.body;
      if (!email) throw customError(errorList.emailIsRequire);
      if (!token) throw customError(errorList.tokenIsRequire);
      if (!password) throw customError(errorList.newPasswordIsRequire);

      const user = await UserService.findByEmail(email as string);
      if (!user) throw customError(errorList.userNotFound);
      if (user.status !== "ACTIVE") throw customError(errorList.userIsInactive);
      if (user.token !== token) {
        throw customError(errorList.tokenOrEmailIsInvalid);
      }

      const isPasswordUsed = await UserService.checkPasswordHistory(
        user.id,
        password
      );

      if (isPasswordUsed) throw customError(errorList.passwordAlreadyUsed);

      const { updatedRows } = await UserService.resetPassword(
        email as string,
        password
      );

      if (updatedRows <= 0) throw customError(errorList.changePasswordFailed);

      await UserService.savePasswordHistory(
        user.id,
        user.password_history,
        user.password
      );

      res
        .status(200)
        .json({ status: "success", message: "Reset password success" });
    } catch (error) {
      next(error);
    }
  }

  //membuat static untuk get profile detail berdasarkan user id dari req user
  static async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).user;
      const user = await UserService.profile(id as string);
      if (!user) throw customError(errorList.userNotFound);
      res.status(200).json({
        status: "success",
        message: "Get profile success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  //membuat static untuk get detail user berdasarkan id dari req params
  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.detail(id as string);
      if (!user) throw customError(errorList.userNotFound);
      res.status(200).json({
        status: "success",
        message: "Get detail user success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  //membuat static untuk update user berdasarkan id dari req user
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).user;
      const {
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
      } = req.body;
      const user = await UserService.update(
        id as string,
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
        identity_card
      );
      if (user <= 0) throw customError(errorList.updateUserFailed);
      res.status(200).json({
        status: "success",
        message: "Update user success",
      });
    } catch (error) {
      next(error);
    }
  }

  //membuat index user dengan pagination, limit, dan offset, search, sort, dan filter
  static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, size, search, sort, order, province, city } = req.query;

      const limit = size ? Number(size) : 10;
      const offset = page ? (Number(page) - 1) * limit : 0;

      const users = await UserService.index(
        limit,
        offset,
        search as string,
        sort as string,
        order as string,
        province as string,
        city as string
      );

      res.status(200).json({
        status: "success",
        message: "Get users success",
        pageNow: page || 1,
        totalItem: users.count,
        totalPage: Math.ceil(users.count / limit),
        data: users.rows,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
