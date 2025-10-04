import { v2 as cloudinary } from "cloudinary";
import config from "./config.js";

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloudinary_api,
  api_secret: config.cloudinary_secret,
});

export default cloudinary;
