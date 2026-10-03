"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const error_handler_middleware_1 = __importDefault(require("./error_handler.middleware"));
const jwt_utlis_1 = require("../utils/jwt.utlis");
const user_model_1 = __importDefault(require("../models/user.model"));
const authenticate = (roles) => {
    return async (req, res, next) => {
        try {
            // get cookies fon req
            const cookie = req.cookies ?? {};
            const token = cookie["access_token"];
            console.log("access_token", token);
            if (!token) {
                throw new error_handler_middleware_1.default("Unauthorized. Access denied", 401);
            }
            const decodedData = (0, jwt_utlis_1.decodeToken)(token);
            console.log(decodedData);
            if (!decodedData) {
                throw new error_handler_middleware_1.default("Unauthorized. Access denied", 401);
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
                throw new error_handler_middleware_1.default("Unauthorized. Access denied", 401);
            }
            //* find user
            const user = await user_model_1.default.findOne({
                _id: decodedData?._id,
                email: decodedData?.email,
            });
            if (!user) {
                res.clearCookie("access_token", {
                    sameSite: isDevelopment ? "lax" : "none",
                    httpOnly: true,
                    secure: isDevelopment ? false : true,
                });
                throw new error_handler_middleware_1.default("Unauthorized. Access denied", 401);
            }
            //  a = [1,2,3,4]  -> a.includes(10) -> false
            // role based auth. // ['ADMIN] -> user.role = user
            if (roles && roles.length > 0 && !roles.includes(user.role)) {
                throw new error_handler_middleware_1.default('Forbidden. Access denied', 403);
            }
            // req.user = user
            req.user = {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            };
            next();
            //
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authenticate = authenticate;
