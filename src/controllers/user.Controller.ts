import type { Request, Response } from 'express';
import { isEmailValid, isStrongPassword, isUserTypeValid, validateCPF} from '../utils/validators.js';
import type { UserService } from '../services/UserService.js';
import type { UserDTO } from '../@types/index.js';

export class UserController{

  constructor(private userService: UserService){}

  //Constante de listagem de usuarios
  getUsers = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string ?? '1');
      const limit = parseInt(req.query.limit as string ?? '10');

      const {data, total} = await this.userService.findAll(page, limit);

      return res.status(200).json({data, total, limit, totalPages: Math.ceil(total / limit)});
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id ?? '0');
      if (!userId) return res.status(400).json({ message: 'ID inválido' });

      const usuario = await this.userService.findById(userId);
      if (!usuario)return res.status(404).json({ message: 'Usuário não encontrado' });

      return res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro interno ao buscar usuário', error });
    }
  };

  //Constante de criação de usuario
  createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password, cpf, type } = req.body;

      if (!name || !email || !password || !cpf || !type) return res.status(400).json({ message: 'Todos os campos são obrigatórios' });

      if ((name as string).length > 16) return res.status(400).json({ message: 'Nome deve ter até 16 caracteres máximos' });
      if (!validateCPF(cpf)) return res.status(400).json({ message: 'CPF inválido' });
      if (!isEmailValid(email)) return res.status(400).json({ message: 'Email inválido' });
      if (!isStrongPassword(password)) return res.status(400).json({ message: 'Senha fraca' });
      if (!isUserTypeValid(type)) return res.status(400).json({ message: 'Tipo inválido'});

      const emailExists = await this.userService.emailAlreadyExists(email);
      if(emailExists) return res.status(409).json({ message: 'Email já cadastrado' });

      await this.userService.create({name, email, password, cpf, type});

      return res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao criar usuário', error });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password, cpf, type } = req.body; 

      const userId = parseInt(req.params.id ?? '0');
      if (!userId) return res.status(400).json({ message: 'ID inválido' });

      if (!name || !email || !password || !cpf || !type) return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      
      if ((name as string).length > 16) return res.status(400).json({ message: 'Nome deve ter até 16 caracteres máximos' });
      if (!validateCPF(cpf)) return res.status(400).json({ message: 'CPF inválido' });
      if (!isEmailValid(email)) return res.status(400).json({ message: 'Email inválido' });
      if (!isStrongPassword(password)) return res.status(400).json({ message: 'Senha fraca' });
      if (!isUserTypeValid(type)) return res.status(400).json({ message: 'Tipo inválido'});

      const result = await this.userService.update({name, email, password, cpf, type, id_user: userId});

      if (!result) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao atualizar usuário', error });
    }
  };

  //usuario comum pode editar perfil.
  updateMe = async (req: Request, res: Response) => {
    try {
      const { name, password, cpf } = req.body;
      const userId = req.user!.id_user;  // vem do token

      if (!name || !password || !cpf) return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      if ((name as string).length > 16) return res.status(400).json({ message: 'Nome deve ter até 16 caracteres máximos' });
      if (!validateCPF(cpf))           return res.status(400).json({ message: 'CPF inválido' });
      if (!isStrongPassword(password)) return res.status(400).json({ message: 'Senha fraca' });

      const result = await this.userService.updateMe({name, password, cpf, id_user: userId});
      if (!result) return res.status(404).json({ message: 'Usuário não encontrado' });

      const updatedUser = await this.userService.findById(userId);

      return res.status(200).json({ 
        message: 'Usuário editado com sucesso!', 
        user: { id_user: updatedUser!.id_user, name: updatedUser!.name, email: updatedUser!.email, cpf: updatedUser!.cpf, type: updatedUser!.type } as UserDTO
        });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao editar usuário', error });
    }
  };

   deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id ?? '0');
      
      const result = await this.userService.delete(userId);
      if (!result) return res.status(404).json({ message: 'Usuário não encontrado' });

      return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao deletar usuário', error });
    }
  };

}