import type { Request, Response } from 'express';
import { isEmailValid, isStrongPassword, isUserTypeValid, validateCPF} from '../utils/validators.js';
import type { UserService } from '../services/user.Service.js';
import type { UpdateMeUserQueryPayload, UserDTO, UserPaginatedQueryPayload, UserQueryPayload } from '../@types/index.js';

export class UserController{

  constructor(private userService: UserService){}

  //Constante de listagem de usuarios
  getUsersPaginated = async (req: Request, res: Response) : Promise<Response> => {
    try {
      const buildQuery = (): UserPaginatedQueryPayload => ({
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 10,
          name: req.query.name as string || undefined,
          email: req.query.email as string || undefined,
          cpf: req.query.cpf as string || undefined,
          type: req.query.type as string || undefined
      })

      const result = await this.userService.findAllPaginated(buildQuery());
      if(!result) return res.status(404).json({ message: 'Usuarios paginados não encontrados' });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar usuários paginados', error });
    }
  };

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try{

      const result = await this.userService.findAll();
      if(!result) return res.status(404).json({ message: 'Usuarios não encontrados' });

      return res.status(200).json(result as UserDTO[]);
    }catch(error){
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar usuarios', error });
    }
  }

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = parseInt(req.params.id ?? '0');
      if (!userId) return res.status(400).json({ message: 'ID inválido' });

      const data = await this.userService.findById(userId);
      if (!data) return res.status(404).json({ message: 'Usuário não encontrado' });

      return res.status(200).json({data: data as UserDTO});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro interno ao buscar usuário', error });
    }
  };

  //Constante de criação de usuario
  createUser = async (req: Request, res: Response): Promise<Response> => {
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
      
      const buildQuery = (): UserQueryPayload => ({name, email, password, cpf, type});

      const newUserId = await this.userService.create(buildQuery());

      return res.status(201).json({ message: 'Usuário criado com sucesso!', id_user: newUserId });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao criar usuário', error });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, password, cpf, type } = req.body; 

      const id_user = parseInt(req.params.id ?? '0');
      if (!id_user) return res.status(400).json({ message: 'ID inválido' });

      if (!name || !email || !password || !cpf || !type) return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      
      if ((name as string).length > 16) return res.status(400).json({ message: 'Nome deve ter até 16 caracteres máximos' });
      if (!validateCPF(cpf)) return res.status(400).json({ message: 'CPF inválido' });
      if (!isEmailValid(email)) return res.status(400).json({ message: 'Email inválido' });
      if (!isStrongPassword(password)) return res.status(400).json({ message: 'Senha fraca' });
      if (!isUserTypeValid(type)) return res.status(400).json({ message: 'Tipo inválido'});

      const buildQuery = (): UserQueryPayload => ({name, email, password, cpf, type});

      const result = await this.userService.update(buildQuery(), id_user);

      if (!result) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao atualizar usuário', error });
    }
  };

  //usuario comum pode editar perfil.
  updateMe = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, password, cpf } = req.body;
      const id_user = req.user!.id_user;  // vem do token

      if (!name || !password || !cpf) return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      if ((name as string).length > 16) return res.status(400).json({ message: 'Nome deve ter até 16 caracteres máximos' });
      if (!validateCPF(cpf)) return res.status(400).json({ message: 'CPF inválido' });
      if (!isStrongPassword(password)) return res.status(400).json({ message: 'Senha fraca' });

      const buildQuery = (): UpdateMeUserQueryPayload => ({name, password, cpf});

      const result = await this.userService.updateMe(buildQuery(), id_user);
      if (!result) return res.status(404).json({ message: 'Usuário não encontrado' });

      const updatedUser = await this.userService.findById(id_user);

      return res.status(200).json({ 
        message: 'Usuário editado com sucesso!', 
        user: updatedUser as UserDTO
        });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao editar usuário', error });
    }
  };

   deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id_user = parseInt(req.params.id ?? '0');
      
      const result = await this.userService.delete(id_user);
      if (!result) return res.status(404).json({ message: 'Usuário não encontrado' });

      return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao deletar usuário', error });
    }
  };

}