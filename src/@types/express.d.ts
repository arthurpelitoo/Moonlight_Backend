declare global {
  namespace Express {
    interface Request {
      user?: { id_user: number, type: "admin" | "customer" };
    }
  }
}

export {};