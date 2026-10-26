declare global {
  namespace Express {
    interface Request {
      user?: {
        id_user: number,
        roles: string[],
        role_version: number,
        // type: "admin" | "customer";
      };
    }
  }
}

export {};
