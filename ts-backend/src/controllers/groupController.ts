import { Request, Response } from "express";
import prisma from "../prisma";
import { groupCreateSchema } from "../zodSchema";

export const createGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parseResult = groupCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(422).json({
      success: false,
      message: "Invalid request body.",
      errors: parseResult.error.errors,
    });
  }

  const { name, description, groupCode } = parseResult.data;
  const teacherId = req.body.id

  try {
    const group = await prisma.group.create({
      data: {
        name,
        description,
        groupCode,
        teacherId
      },
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully.",
      group,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "The provided group code is already in use.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

