import { Router } from "express";
import { testController } from "../controllers/testController.js";

const router = Router();

router.post("/reset-database", testController.resetDatabase);
router.post("/seed/recommendations", testController.seedDatabase);

export default router;
