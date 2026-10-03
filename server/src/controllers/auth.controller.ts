import { NextFunction, Request, RequestHandler, Response } from "express";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import CustomError from "../middlewares/error_handler.middleware";
import { asyncHandler } from "../utils/asynchandler.utils";
import { upload } from "../utils/cloudinary.utils";
import { generateToken } from "../utils/jwt.utlis";
import { sendEmail } from "../utils/nodemailer.utils";
import sendRegistrationSuccessEmail from "../utils/email.utils";

//? register user
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Register request body:", req.body);
    console.log("Register request file:", req.file);

    const { first_name, last_name, email, password, phone } = req.body;

    const file = req.file;

    if (!first_name || !last_name) {
      throw new CustomError("First name and last name are required", 400);
    }
    if (!email) {
      throw new CustomError("Email is required", 400);
    }
    if (!password) {
      throw new CustomError("Password is required", 400);
    }

    const user = new User({ first_name, last_name, email, phone });

    const hashedPass = await hashPassword(password);

    // update user password to hashed password
    user.password = hashedPass;

    //! image
    if (file) {
      const { path, public_id } = await upload(file?.path, "/profile_images");

      user.profile_image = {
        path: path,
        public_id,
      };
    }

    //! save user
    await user.save();

    // never leak the password hash in the response
    const safeUser = user.toObject() as Record<string, any>;
    delete safeUser.password;

    res.status(201).json({
      message: "Account created",
      status: "success",
      data: safeUser,
    });
  }
);

//? login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email) {
      throw new CustomError("Email is required", 400);
    }
    if (!password) {
      throw new CustomError("Password is required", 400);
    }

    //* check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new CustomError("email or password does not match", 400);
    }

    //* compare password
    const isPassMatch = await comparePassword(password, user?.password || "");

    if (!isPassMatch) {
      throw new CustomError("email or password does not match", 400);
    }

    //! generate jwt token
    const access_token = generateToken({
      _id: user._id,
      email: user.email as string,
      first_name: user.first_name as string,
      last_name: user.last_name as string,
      role: user.role,
    });

    // Send welcome/login email (not registration email)
    // sendRegistrationSuccessEmail(user); // Commented out - wrong email for login

    const isDevelopment = process.env.NODE_ENV === "development";

    // never leak the password hash in the response
    const safeUser = user.toObject() as Record<string, any>;
    delete safeUser.password;

    res
      .cookie("access_token", access_token, {
        sameSite: isDevelopment ? "lax" : "none",
        httpOnly: true,
        secure: isDevelopment ? false : true,
        maxAge:
          Number(process.env.COOKIE_EXPIRES_IN || "7") * 24 * 60 * 60 * 1000,
      })
      .status(200) // 200 for login, not 201
      .json({
        message: "Login successful",
        status: "success",
        data: safeUser,
      });
  }
);

//! logout
export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    const isDevelopment = process.env.NODE_ENV === "development";

    res.clearCookie("access_token", {
      sameSite: isDevelopment ? "lax" : "none",
      httpOnly: true,
      secure: isDevelopment ? false : true,
    });

    res.status(200).json({
      message: "Logged out successfully",
      status: "success",
    });
  }
);

// change pass
// const changePassword = asyncHandler(async (req:Request,res:Response) => {
//     // api logic
// })

//! get user profile
export const me = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?._id;
  const user = await User.findOne({ _id: id });

  res.status(200).json({
    data: user,
    message: "Profile fetched",
  });
});

//! update profile (name, phone)
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?._id;
    const { first_name, last_name, phone } = req.body;

    if (!first_name && !last_name && phone === undefined) {
      throw new CustomError("Nothing to update", 400);
    }

    const updates: Record<string, any> = {};
    if (first_name) updates.first_name = String(first_name).trim();
    if (last_name) updates.last_name = String(last_name).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    res.status(200).json({
      message: "Profile updated",
      status: "success",
      data: user,
    });
  }
);

//! change password
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?._id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      throw new CustomError(
        "current_password and new_password are required",
        400
      );
    }

    if (String(new_password).length < 6) {
      throw new CustomError("New password must be at least 6 characters", 400);
    }

    const user = await User.findOne({ _id: id }).select("+password");
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const isMatch = await comparePassword(
      String(current_password),
      user.password || ""
    );
    if (!isMatch) {
      throw new CustomError("Current password is incorrect", 400);
    }

    user.password = await hashPassword(String(new_password));
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
      status: "success",
    });
  }
);
