import type { UserService } from '../services/user.Service.js';
import type { NextFunction, Request, Response } from 'express';
import type { CreateUserDTO, GetUsersPaginatedDTO, UpdateMeDTO, UpdateUserDTO } from '../@types/user/dto/user.input.dto.js';
import { AppError } from '../utils/AppError.js';
import { toInt } from '../utils/queryParser.js';
import { parseUserQuery } from '../query/parsers/userParser.js';


export class UserController{

  constructor(private userService: UserService){}

  //Constante de listagem de usuarios
  getUsersPaginated = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {

      const users = await this.userService.findAllPaginated(parseUserQuery(req.query));
      if(!users) throw new AppError("Usuarios paginados não encontrados", 404, "NOT_FOUND_PAG_USERS");

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{

      const users = await this.userService.findAll();
      if(!users) throw new AppError("Usuarios não encontrados", 404, "NOT_FOUND_USERS");

      res.status(200).json(users);
    }catch(error){
      next(error);
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id_user = toInt(req.params.id, 0);
      if (!id_user) throw new AppError("ID não enviado", 400, "ID_NOT_SENT_OR_INVALID");

      const user = await this.userService.findById(id_user);
      if (!user) throw new AppError("Usuário não encontrado", 404, "NOT_FOUND_USER_BY_ID");

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  //Constante de criação de usuario
  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateUserDTO;

      await this.userService.create(dto);

      res.status(201).json({ message: 'Usuário criado com sucesso!'});
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as UpdateUserDTO; 

      const id_user = toInt(req.params.id, 0);
      if (!id_user) throw new AppError("ID não enviado", 400, "ID_NOT_SENT_OR_INVALID");

      await this.userService.update({...dto, id_user});

      res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  //usuario comum pode editar perfil.
  updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as UpdateMeDTO;
      const id_user = req.user!.id_user;  // vem do token
      if (!id_user) throw new AppError("ID não enviado", 400, "ID_NOT_SENT_OR_INVALID");

      await this.userService.updateMe({...dto, id_user});

      const updatedUser = await this.userService.findById(id_user);

      res.status(200).json({ message: 'Usuário editado com sucesso!', user: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id_user = toInt(req.params.id, 0);
      if (!id_user) throw new AppError("ID não enviado", 400, "ID_NOT_SENT_OR_INVALID");
      
      const result = await this.userService.delete(id_user);
      if (!result) throw new AppError("Usuário não encontrado", 404, "NOT_FOUND_USER_TO_DELETE");

      res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
      next(error)
    }
  };

}