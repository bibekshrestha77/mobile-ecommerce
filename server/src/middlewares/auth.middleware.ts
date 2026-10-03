import { NextFunction, Request, Response } from "express";
import CustomError from "./error_handler.middleware";
import { decodeToken } from "../utils/jwt.utlis";
import User from "../models/user.model";
import { Role } from "../@types/enum.types";

export const authenticate = (roles?:Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get cookies fon req
      const cookie = req.cookies ?? {};
      const token = cookie["access_token"];

      console.log("access_token", token);
      if (!token) {
        throw new CustomError("Unauthorized. Access denied", 401);
      }

      const decodedData = decodeToken(token);
      console.log(decodedData);

      if (!decodedData) {
        throw new CustomError("Unauthorized. Access denied", 401);
      }

      // if (a & b) {

      // }
      // check for expiry
      const isDevelopment = process.env.NODE_ENV === "development";
      if (decodedData?.exp && decodedData?.exp * 1000 < Date.now()) {
        res.clearCookie("access_token", {
          sameSite: isDevelopment ? "lax" : "none",
          httpOnly: true,
          secure: isDevelopment ? false : true,
        });

        throw new CustomError("Unauthorized. Access denied", 401);
      }

      //* find user
      const user = await User.findOne({
        _id: decodedData?._id,
        email: decodedData?.email,
      });

      if (!user) {
        res.clearCookie("access_token", {
          sameSite: isDevelopment ? "lax" : "none",
          httpOnly: true,
          secure: isDevelopment ? false : true,
        });

        throw new CustomError("Unauthorized. Access denied", 401);
      }
//  a = [1,2,3,4]  -> a.includes(10) -> false
      // role based auth. // ['ADMIN] -> user.role = user
      
      if (roles && roles.length > 0 && !roles.includes(user.role)) {
        throw new CustomError('Forbidden. Access denied',403)
      }


      // req.user = user

      req.user = {
        _id: user._id,
        email: user.email as string,
        first_name: user.first_name as string,
        last_name: user.last_name as string,
        role:user.role
      }
      
      next();
      //
    } catch (error) {
      next(error);
    }
  };
};