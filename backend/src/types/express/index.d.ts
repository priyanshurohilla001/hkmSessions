// src/types/express/index.d.ts

declare global {
  namespace Express {
    interface Request {
      id?: number; // This will store teacherId or studentId
    }
  }
}

export {};
