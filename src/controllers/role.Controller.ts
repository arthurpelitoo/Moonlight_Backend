import type { Request, Response, NextFunction } from 'express';
import type { RoleService } from '../services/role.Service.js';
import { toInt } from '../utils/queryParser.js';
import { AppError } from '../utils/AppError.js';

export class RoleController {

  constructor(private roleService: RoleService) { }

  getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.roleService.findAll();
      if (!roles)
        throw new AppError("Roles não encontrados", 404, "NOT_FOUND_ROLES");

      res.status(200).json(roles);
    } catch (error) {
      next(error);
    }
  }

  syncUserRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id_user = toInt(req.params.id, 0);
      const { id_roles } = req.body as { id_roles: number[] }

      await this.roleService.syncUserRoles(id_user, id_roles);
      res.status(200).json({ message: 'Cargos atualizados com sucesso!' });
    } catch (error) {
      next(error);
    }
  }
}
