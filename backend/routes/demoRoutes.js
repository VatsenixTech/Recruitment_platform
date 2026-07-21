import express from "express";
import {
  createDemoRequest,
  getDemoRequests,
} from "../controllers/demoController.js";

const router = express.Router();

router.post("/", createDemoRequest);

/*
  Protect this route with your admin authentication middleware
  before using it in production.
*/
router.get("/", getDemoRequests);

export default router;