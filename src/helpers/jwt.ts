import jwt from "jsonwebtoken";
const SECRETKEY = process.env.JWT_KEY || "ini tidak aman";

export const encrypt = (payload: any): string => {
  return jwt.sign(payload, SECRETKEY);
};

export const decrypt = (token: string): any => {
  return jwt.verify(token, SECRETKEY);
};
