import express from "express";
import {
  createDemoRequest,
  createTrialSignup,
  getRecruiterLandingMetrics,
} from "../controllers/publicRecruiterController.js";

const router = express.Router();

router.get("/metrics", getRecruiterLandingMetrics);
router.post("/demo-requests", createDemoRequest);
router.post("/trial-signups", createTrialSignup);

export default router;