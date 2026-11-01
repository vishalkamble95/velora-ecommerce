import { Router } from "express";
import {
  register,
  login,
  getProfile,
  logout,
} from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { validateBody } from "../middleware/validate.middleware.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.get("/profile", authenticate, getProfile);

router.post("/logout", logout);

export default router;
