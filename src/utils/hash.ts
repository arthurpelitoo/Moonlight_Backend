import bcrypt from "bcryptjs";

export const generateHash = async (password: string): Promise<String> => {
    return await bcrypt.hash(password, 12);
}