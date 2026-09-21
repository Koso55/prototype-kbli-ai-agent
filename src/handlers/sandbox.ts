import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../middlewares';

export const simpleSandboxGethandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // res.status(200).json({ message: "You've reached sanbox handlers" });
    throw new CustomError(
      'This is an intentional Error, do not panic',
      'IntentionalError',
      400,
    );
  } catch (error) {
    next(error);
  }
};
