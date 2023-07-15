import { CustomError } from "../interfaces/errorInterface";

export const customError = (errName: CustomError) => {
  const error = {
    name: "customError",
    code: errName.code,
    message: errName.message,
  };
  return error;
};
