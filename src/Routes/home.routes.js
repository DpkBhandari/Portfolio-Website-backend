import express from "express";
import {
  getHome,
  createHome,
  updateHome,
} from "../Controllers/home.controllers.js";

import { authenticate } from "../Middleware/authVerifier.js";

const HomeRoutes = express.Router();

HomeRoutes.get("/", getHome);

HomeRoutes.post("/", authenticate, createHome);

HomeRoutes.put("/:id", authenticate, updateHome);

export default HomeRoutes;
