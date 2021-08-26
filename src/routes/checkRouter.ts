import express from "express";
const router = express.Router();

import { CheckController } from "../controllers/CheckController"
import isValidToken from "../middlewares/verifyToken"

router.delete("/delete", isValidToken, new CheckController().deleteCheck);
router.post("/create", isValidToken, new CheckController().createCheck);
router.put("/updatet", isValidToken, new CheckController().updateCheck);
router.put("/pause", isValidToken, new CheckController().pauseCheck);
router.get("/myReports", isValidToken, new CheckController().getMyChecs);
router.post("/groupChecksByTag", isValidToken, new CheckController().groupChecksByTag);

export default router;


