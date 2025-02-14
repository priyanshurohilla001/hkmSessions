import { Request, Response } from "express";
import { teacherLoginSchema, teacherSignupSchema } from "../zodSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const teacherSignUpController = async (req: Request, res: Response): Promise<any>=> {
  // Validate input with trimmed data (via zod preprocess)
  const parseResult = teacherSignupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(422).json({ success: false, errors: parseResult.error.errors });
  }
  const { name, email, password, phone } = parseResult.data;

  // Ensure token secrets exist
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    return res.status(500).json({ success: false, message: "Token secrets are not configured." });
  }
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use a transaction to ensure atomicity (if any step fails, nothing is committed)
    const result = await prisma.$transaction(async (tx) => {
      // Create the teacher record
      const teacher = await tx.teacher.create({
        data: { name, email, password: hashedPassword, phone },
      });

      // Generate tokens
      const accessToken = jwt.sign(
        { teacherId: teacher.id },
        accessTokenSecret!,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { teacherId: teacher.id },
        refreshTokenSecret!,
        { expiresIn: "30d" }
      );

      // Update the teacher with the refresh token
      const updatedTeacher = await tx.teacher.update({
        where: { id: teacher.id },
        data: { refreshToken },
      });

      // Remove sensitive data before sending response
      updatedTeacher.password = "";

      return { teacher: updatedTeacher, tokens: { accessToken, refreshToken } };
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher: result.teacher,
      tokens: result.tokens,
    });
  } catch (error: any) {
    console.error("Error during teacher signup:", error);
    // Handle duplicate email error (Prisma error code P2002)
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const teacherLoginController = async (req: Request, res: Response): Promise<any>=> {
  const parseResult = teacherLoginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(422).json({ success: false, errors: parseResult.error.errors });
  }

  const { email, password } = parseResult.data;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.status(500).json({ success: false, message: "Token secret is not configured." });
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign(
      { teacherId: teacher.id },
      accessTokenSecret!,
      { expiresIn: "1h" }
    );

    teacher.password = "";

    return res.status(200).json({
      success: true,
      message: "Login successful",
      teacher,
      tokens: { accessToken, refreshToken: teacher.refreshToken },
    });
  } catch (error: any) {
    console.error("Error during teacher login:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
