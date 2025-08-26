import { Router, Request, Response } from "express";
import healthcheckRoute from "./healthcheck";
import sandboxRoute from "./sandbox";
import kbliRoute from "./kbli";

const router = Router();

router.use("/healthcheck", healthcheckRoute);
router.use("/sandbox", sandboxRoute);
router.use("/kbli", kbliRoute);

router.use((_: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found. Check the URL and try again.",
  });
});

export default router;
