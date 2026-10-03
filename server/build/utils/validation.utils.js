"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBooleanFields = exports.validatePositiveNumber = exports.validateNumericFields = exports.validateRequiredFields = void 0;
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
// Validation helper functions
const validateRequiredFields = (fields, requiredFields) => {
    const missingFields = requiredFields.filter((field) => !fields[field] || fields[field].toString().trim() === "");
    if (missingFields.length > 0) {
        throw new error_handler_middleware_1.default(`Missing required fields: ${missingFields.join(", ")}`, 400);
    }
};
exports.validateRequiredFields = validateRequiredFields;
const validateNumericFields = (fields, numericFields) => {
    const invalidFields = numericFields.filter((field) => fields[field] !== undefined &&
        fields[field] !== null &&
        isNaN(Number(fields[field])));
    if (invalidFields.length > 0) {
        throw new error_handler_middleware_1.default(`Invalid numeric fields: ${invalidFields.join(", ")}`, 400);
    }
};
exports.validateNumericFields = validateNumericFields;
const validatePositiveNumber = (value, fieldName) => {
    if (value !== undefined && value !== null) {
        const num = Number(value);
        if (isNaN(num) || num < 0) {
            throw new error_handler_middleware_1.default(`${fieldName} must be a positive number`, 400);
        }
    }
};
exports.validatePositiveNumber = validatePositiveNumber;
const validateBooleanFields = (fields, booleanFields) => {
    const invalidFields = booleanFields.filter((field) => fields[field] !== undefined &&
        fields[field] !== null &&
        typeof fields[field] !== "boolean" &&
        fields[field] !== "true" &&
        fields[field] !== "false");
    if (invalidFields.length > 0) {
        throw new error_handler_middleware_1.default(`Invalid boolean fields: ${invalidFields.join(", ")}`, 400);
    }
};
exports.validateBooleanFields = validateBooleanFields;
