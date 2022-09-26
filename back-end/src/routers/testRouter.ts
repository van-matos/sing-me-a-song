import { Router } from "express";
import { testController } from "../controllers/testController.js";

const router = Router();

router.post("/reset", testController.resetDatabase);
router.post("/seed/multi", testController.seedDatabase);
router.post("/seed/single", testController.seedOneDatabase);

export default router;
