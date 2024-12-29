
import express from "express";
import exploreController from "../controllers/exploreController.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const router = express.Router();

router.get("/repos/:language", ensureAuthenticated, exploreController);

export default router;
