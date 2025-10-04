import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const config = {
  port: process.env.PORT,
  mongo_Url: process.env.MONGO_DB,
  phase: process.env.PHASE,
  salt: process.env.SALT,
  jwt_secret: process.env.JWT_SECRET,
  cloudinary_api: process.env.CLOUDINARY_API,
  cloudinary_secret: process.env.CLOUDINARY_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
};

export default Object.freeze(config);
