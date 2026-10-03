import { Request, Response, NextFunction } from "express";
import CustomError from "../middlewares/error_handler.middleware";

// Validation helper functions
export const validateRequiredFields = (
  fields: Record<string, any>,
  requiredFields: string[]
): void => {
  const missingFields = requiredFields.filter(
    (field) => !fields[field] || fields[field].toString().trim() === ""
  );

  if (missingFields.length > 0) {
    throw new CustomError(
      `Missing required fields: ${missingFields.join(", ")}`,
      400
    );
  }
};

export const validateNumericFields = (
  fields: Record<string, any>,
  numericFields: string[]
): void => {
  const invalidFields = numericFields.filter(
    (field) =>
      fields[field] !== undefined &&
      fields[field] !== null &&
      isNaN(Number(fields[field]))
  );

  if (invalidFields.length > 0) {
    throw new CustomError(
      `Invalid numeric fields: ${invalidFields.join(", ")}`,
      400
    );
  }
};

export const validatePositiveNumber = (
  value: any,
  fieldName: string
): void => {
  if (value !== undefined && value !== null) {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      throw new CustomError(`${fieldName} must be a positive number`, 400);
    }
  }
};

export const validateBooleanFields = (
  fields: Record<string, any>,
  booleanFields: string[]
): void => {
  const invalidFields = booleanFields.filter(
    (field) =>
      fields[field] !== undefined &&
      fields[field] !== null &&
      typeof fields[field] !== "boolean" &&
      fields[field] !== "true" &&
      fields[field] !== "false"
  );

  if (invalidFields.length > 0) {
    throw new CustomError(
      `Invalid boolean fields: ${invalidFields.join(", ")}`,
      400
    );
  }
};