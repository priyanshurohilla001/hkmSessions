import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TeacherJwtPayload extends JwtPayload {
  teacherId: number;
}

interface StudentJwtPayload extends JwtPayload {
  studentId: number;
}

export const teacherAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Access token missing" });
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    return res.status(500).json({
      success: false,
      message: "Access token secret not configured",
    });
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as TeacherJwtPayload;
    if (!decoded.teacherId) {
      res.status(401).json({ success: false, message: "Invalid token payload" });
      return;
    }
    
    req.id = decoded.teacherId;
    next();
  } catch (error) {
    console.error("Error in teacherAuthMiddleware:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const studentAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Access token missing" });
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    return res.status(500).json({
      success: false,
      message: "Access token secret not configured",
    });
  }

  try {
    // Verify token and extract payload for student
    const decoded = jwt.verify(token, accessTokenSecret) as StudentJwtPayload;
    if (!decoded.studentId) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
      
    }

    req.id = decoded.studentId;
    next();
  } catch (error) {
    console.error("Error in studentAuthMiddleware:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
