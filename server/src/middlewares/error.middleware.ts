import {NextFunction, Request, Response} from 'express';
import {HttpError} from 'http-errors';
import httpStatus from 'http-status';

const errorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong',
  });
};

export default errorMiddleware;
