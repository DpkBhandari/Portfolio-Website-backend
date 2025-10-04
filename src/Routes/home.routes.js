import express from "express";
import {
  getHome,
  createHome,
  updateHome,
} from "../Controllers/home.controllers.js";

import { authenticate } from "../Middleware/authVerifier.js";

const router = express.Router();

router.get("/", getHome);

router.post("/", authenticate, createHome);

router.put("/:id", authenticate, updateHome);

export default router;
