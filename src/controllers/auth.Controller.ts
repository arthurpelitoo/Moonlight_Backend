import type { Request, Response } from 'express';
import { isEmailValid, isStrongPassword, validateCPF } from '../utils/validators.js';
import type { AuthService } from '../services/auth.Service.js';
import type { UserService } from '../services/user.Service.js';
import type { UserDTO } from '../@types/index.js';

export class AuthController {

    constructor(private authService: AuthService, private userService: UserService){
    }

    login = async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        
        const user = await this.authService.findByEmail(email);
        if (!user) return res.status(401).json({ message: 'Email ou senha inválidos' });
        
        const passwordMatch = await this.authService.verifyPassword(password, user.password!);
        if (!passwordMatch) return res.status(401).json({ message: 'Email ou senha inválidos' });

        const secret = process.env.JWT_SECRET;
        if (!secret) return res.status(500).json({ message: 'JWT_SECRET não configurado' });

        const token = this.authService.generateToken(secret, user);

        return res.status(200).json({
          message: 'Login realizado com sucesso!',
          token: token,
          user: { id_user: user.id_user, name: user.name, email: user.email, cpf: user.cpf, type: user.type } as UserDTO
        });
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Erro interno ao realizar login', error });
      }
    };

    registerUser = async (req: Request, res: Response) => {
      try {
        const { name, email, password, cpf } = req.body;

        if (!name || !email || !password || !cpf)
          return res.status(400).json({ message: 'nome, email, senha e cpf são obrigatórios' });

        if ((name as string).length > 16) return res.status(400).json({ message: 'Nome deve ter até 16 caracteres máximos' });
        if (!validateCPF(cpf)) return res.status(400).json({ message: 'CPF inválido' });
        if (!isEmailValid(email)) return res.status(400).json({ message: 'Email inválido' });
        if (!isStrongPassword(password)) return res.status(400).json({ message: 'Senha deve ter pelo menos 8 a 16 caracteres, maiúscula, minúscula, número' });
        
        const emailExists = await this.userService.emailAlreadyExists(email);
        if(emailExists) return res.status(409).json({ message: 'Email já cadastrado' });

        await this.userService.register({name, email, password, cpf});
        return res.status(201).json({ message: 'Usuário criado com sucesso!'});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno ao criar usuário', error });
      }
  };
}