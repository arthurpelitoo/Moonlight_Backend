import type { NextFunction, Request, Response } from 'express';
import type { AuthService } from '../services/auth.Service.js';
import type { UserService } from '../services/user.Service.js';
import type { LoginAuthDTO, RegisterAuthDTO } from '../@types/auth/auth.dto.js';

export class AuthController {

    constructor(private authService: AuthService, private userService: UserService){
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const dto = req.body as LoginAuthDTO;

        const user = await this.authService.login(dto);

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token: user.token,
            user: {id_user: user.id_user, name: user.name, email: user.email, cpf: user.cpf, type: user.type}
          });
      } catch (error) {
          next(error);
      }
    };

    registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const dto = req.body as RegisterAuthDTO;

        await this.userService.register(dto);

       res.status(201).json({ message: 'Usuário registrado com sucesso!'});
      } catch (error) {
        next(error);
      }
  };
}