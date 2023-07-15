import { NextFunction, Request, Response } from "express";
import { errorList } from "../constants/errorList";
import { customError, decrypt } from "../helpers";
const { User } = require("../models");

const BEARER = process.env.BEARER_KEY;

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw customError(errorList.invalidToken);

    const shield = authorization.split(" ")[0];
    if (shield !== BEARER) throw customError(errorList.invalidToken);
    const token = authorization.split(" ")[1];
    if (!token) throw customError(errorList.invalidToken);
    const payload = decrypt(token);
    const user = await User.findByPk(payload.id);
    if (!user) throw customError(errorList.invalidToken);

    if (user.status === "PENDING") throw customError(errorList.userNeedVerify);

    (req as any).user = {
      id: user.id,
      status: user.status,
    };
    next();
  } catch (error) {
    next(error);
  }
};
