"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const generateToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, config_1.jwt_config.secret, {
            expiresIn: config_1.jwt_config.expires_in,
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.generateToken = generateToken;
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, config_1.jwt_config.secret);
    }
    catch (error) {
        console.log(error);
    }
};
exports.decodeToken = decodeToken;
