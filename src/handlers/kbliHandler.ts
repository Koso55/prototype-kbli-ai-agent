import { NextFunction, Request, Response } from "express";
import {
  addEmbeddingToFourthDerivativesService,
  cleanupEmbeddingsFromFourthDerivativeService,
  createVectorSearchIndexForKBLIFourthDerivativeService,
  getAllKbliFirstDerivativeService,
  getAllKbliFourthDerivativeService,
  getAllKbliParentService,
  getAllKbliSecondtDerivativeService,
  getAllKbliThirdDerivativeService,
  insertManyKBLIFirstDerivativeService,
  insertManyKbliFourthDerivativeService,
  insertManyKBLIParentService,
  insertManyKbliSecondDerivativeService,
  insertManyKbliThirdDerivativeService,
  semanticSearchFourthDerivativeService,
} from "../services/kbliService";

/* -------------- PARENT ------------------- */
export const insertManyKbliParentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await insertManyKBLIParentService();
    res.status(201).json({
      status: "success",
      message: "successfully inserted kbli documents",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllKbliParentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllKbliParentService();
    res.status(200).json({
      status: "success",
      message: "successfully get kbli documents",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const insertManyKbliFirstDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(201).json({
      status: "success",
      message: "task will be done in the background immediately",
    });

    setImmediate(async () => {
      try {
        const response = await insertManyKBLIFirstDerivativeService();
        console.log("done?: ", response);
      } catch (err) {
        console.error("Background task failed:", err);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllKbliFirstDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllKbliFirstDerivativeService();
    res.status(200).json({
      status: "success",
      message: "successfully get kbli documents",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const insertManyKbliSecondDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(201).json({
      status: "success",
      message: "task will be done in the background immediately",
    });

    setImmediate(async () => {
      try {
        const response = await insertManyKbliSecondDerivativeService();
        console.log("done?: ", response);
      } catch (err) {
        console.error("Background task failed:", err);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllKbliSecondDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllKbliSecondtDerivativeService();
    res.status(200).json({
      status: "success",
      message: "successfully get kbli documents",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const insertManyKbliThirdDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(201).json({
      status: "success",
      message: "task will be done in the background immediately",
    });

    setImmediate(async () => {
      try {
        const response = await insertManyKbliThirdDerivativeService();
        console.log("done?: ", response);
      } catch (err) {
        console.error("Background task failed:", err);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllKbliThirdDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllKbliThirdDerivativeService();
    res.status(200).json({
      status: "success",
      message: "successfully get kbli documents",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const insertManyKbliFourthDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(201).json({
      status: "success",
      message: "task will be done in the background immediately",
    });

    setImmediate(async () => {
      try {
        const response = await insertManyKbliFourthDerivativeService();
        console.log("done?: ", response);
      } catch (err) {
        console.error("Background task failed:", err);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllKbliFourthDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllKbliFourthDerivativeService();
    res.status(200).json({
      status: "success",
      message: "successfully get kbli documents",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const createVectorSearchIndexForKBLIFourthDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response =
      await createVectorSearchIndexForKBLIFourthDerivativeService();
    res.status(201).json({
      status: "success",
      message: "successfully created vector search index",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const addEmbeddingsToFourthDerivativesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: "success",
      message: "data will be inserted in the background",
    });

    setImmediate(async () => {
      try {
        const response = await addEmbeddingToFourthDerivativesService();
        console.log("done?: ", response);
      } catch (err) {
        console.error("Background task failed:", err);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const semanticSearchFourthDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.body;
    const response = await semanticSearchFourthDerivativeService(query);
    res.status(200).json({
      status: "success",
      message: "data will be cleaned up in the background",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const cleanupEmbeddingsFromFourthDerivativeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: "success",
      message: "data will be cleaned up in the background",
    });

    setImmediate(async () => {
      try {
        const response = await cleanupEmbeddingsFromFourthDerivativeService();
        console.log("done?: ", response);
      } catch (err) {
        console.error("Background task failed:", err);
      }
    });
  } catch (error) {
    next(error);
  }
};
