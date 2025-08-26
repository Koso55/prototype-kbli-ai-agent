import { Router } from "express";
import { healtcheckHandler } from "../handlers";

const router = Router();

router.get("/", healtcheckHandler);

export default router;
