import { z } from "zod";

export const teacherSignupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .regex(/^[A-Za-z\s.'-]+$/, {
      message:
        "Name can only contain letters, spaces, periods, apostrophes, and hyphens",
    }),

  email: z.string().email({ message: "Invalid email address" }),

  phone: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be exactly 10 digits",
  }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
});

export const teacherLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
});


export const groupCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Group name is required" })
    .max(100, { message: "Group name must be less than 100 characters" }),
  description: z
    .string()
    .min(1, { message: "Group description is required" })
    .max(500, { message: "Group description must be less than 500 characters" }),
  groupCode: z
    .string()
    .min(1, { message: "Group code is required" })
    .max(50, { message: "Group code must be less than 50 characters" }),
});


export type TeacherSignupType = z.infer<typeof teacherSignupSchema>;
