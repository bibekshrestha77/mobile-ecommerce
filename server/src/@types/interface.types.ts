import jwt from "jsonwebtoken";
import { Role } from "../@types/enum.types";
import mongoose from "mongoose";


export interface IPayload {
  _id: mongoose.Types.ObjectId,
  role: Role,
  email: string,
  first_name: string,
  last_name: string
}
