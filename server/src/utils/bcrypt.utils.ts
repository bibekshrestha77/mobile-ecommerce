import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("bcrypt error");
  }
};

export const comparePassword  =  async (password: string, hash:string) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("bcrypt error");
  }
};
