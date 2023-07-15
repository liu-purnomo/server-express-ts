import bcryptjs from "bcryptjs";

const salt = bcryptjs.genSaltSync(10);

export const hashPassword = (password: string) => {
  return bcryptjs.hashSync(password, salt);
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcryptjs.compareSync(password, hashedPassword);
};
