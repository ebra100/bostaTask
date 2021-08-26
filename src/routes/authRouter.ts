import express from "express";
const router = express.Router();

import { AuthenticationController } from "../controllers/AuthenticationController"

router.post("/signup", new AuthenticationController().signUp);
router.post("/verifyEmail", new AuthenticationController().verifyEmail);

export default router;


