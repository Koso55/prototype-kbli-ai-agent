import { Router, Request, Response } from "express";
import {
  addEmbeddingsToFourthDerivativesHandler,
  cleanupEmbeddingsFromFourthDerivativeHandler,
  createVectorSearchIndexForKBLIFourthDerivativeHandler,
  getAllKbliFirstDerivativeHandler,
  getAllKbliFourthDerivativeHandler,
  getAllKbliParentHandler,
  getAllKbliSecondDerivativeHandler,
  getAllKbliThirdDerivativeHandler,
  insertManyKbliFirstDerivativeHandler,
  insertManyKbliFourthDerivativeHandler,
  insertManyKbliParentHandler,
  insertManyKbliSecondDerivativeHandler,
  insertManyKbliThirdDerivativeHandler,
  semanticSearchFourthDerivativeHandler,
} from "../handlers/kbliHandler";

const router = Router();

router.post("/parent", insertManyKbliParentHandler);
router.get("/parent", getAllKbliParentHandler);

router.post("/first", insertManyKbliFirstDerivativeHandler);
router.get("/first", getAllKbliFirstDerivativeHandler);

router.post("/second", insertManyKbliSecondDerivativeHandler);
router.get("/second", getAllKbliSecondDerivativeHandler);

router.post("/third", insertManyKbliThirdDerivativeHandler);
router.get("/third", getAllKbliThirdDerivativeHandler);

router.post("/fourth", insertManyKbliFourthDerivativeHandler);
router.get("/fourth", getAllKbliFourthDerivativeHandler);
router.post("/fourth/semantic", semanticSearchFourthDerivativeHandler);

// router.post(
//   "/fourth/config/vector-search-index",
//   createVectorSearchIndexForKBLIFourthDerivativeHandler
// );
router.post(
  "/fourth/config/embeddings",
  addEmbeddingsToFourthDerivativesHandler
);
router.put(
  "/fourth/config/embeddings/cleanup",
  cleanupEmbeddingsFromFourthDerivativeHandler
);

router.use((_: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found. Check the URL and try again.",
  });
});

export default router;
