import { Router } from "express";
import { simpleSandboxGethandler } from "../handlers";

const router = Router();

router.get("/", simpleSandboxGethandler);
router.get("/google-sign-in", simpleSandboxGethandler);

export default router;
