import bcrypt from "bcryptjs";
import config from "../config/config.js";
export async function hashing(password) {
  const salt = Number(config.salt) || 12;
  return await bcrypt.hash(password, salt);
}

export async function compare(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
