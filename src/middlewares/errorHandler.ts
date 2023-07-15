import { NextFunction, Request, Response } from "express";
import { CustomErrorOutput } from "../interfaces/errorInterface";

export const errorHandler = async (
  err: CustomErrorOutput,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  let code = 500;
  let message = "Internal Server Error";

  if (err.name === "customError") {
    code = err.code;
    message = err.message;
  }

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    code = 400;
    message =
      err.errors && err.errors.length > 0
        ? err.errors[0].message
        : "Validation Error";
  }

  if (
    err.name === "SequelizeDatabaseError" ||
    err.name === "SequelizeForeignKeyConstrainError"
  ) {
    code = 400;
    message = err.message;
  }

  if (err.name === "SequelizeTimeoutError") {
    code = 408;
    message = err.message;
  }

  if (err.name === "JsonWebTokenError") {
    code = 401;
    message = "Invalid access token";
  }

  res.status(code).json({
    status: "error",
    message,
  });
};
