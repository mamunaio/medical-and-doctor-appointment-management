import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { apiResponse } from "@/lib/apiResponse";
import { validateRequest, loginSchema } from "@/lib/validators";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const { data, error } = validateRequest(loginSchema, body);
    if (error) return apiResponse.error("Validation failed", 400);

    const user = await User.findOne({ email: data.email });
    if (!user) return apiResponse.error("Invalid credentials", 401);

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) return apiResponse.error("Invalid credentials", 401);

    if (!user.isActive) return apiResponse.error("Account is suspended", 403);

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return apiResponse.success({ user: userObj, token }, "Login successful");
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}
