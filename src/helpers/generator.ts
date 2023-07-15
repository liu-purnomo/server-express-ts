import { v4 as uuidv4 } from "uuid";

export const tokenGenerator = (length: number): string => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

export const uuidStringGenerator = (): string => {
  const uuid = uuidv4();
  return uuid.toString();
};
