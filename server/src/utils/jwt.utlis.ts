import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../@types/enum.types";
import { jwt_config } from "../config/config";
import { IPayload } from "../@types/interface.types";



export const generateToken = (payload: IPayload) => {
  try {
    return jwt.sign(payload, jwt_config.secret, {
      expiresIn: jwt_config.expires_in as any,
    });
  } catch (error) {
    console.log(error);
  }
};


export const decodeToken = (token:string) => {
  try {
    return jwt.verify(token, jwt_config.secret) as JwtPayload
  } catch (error) {
    console.log(error)
  }
}