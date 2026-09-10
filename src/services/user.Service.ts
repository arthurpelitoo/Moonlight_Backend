import type { PaginatedResponse } from '../@types/common/pagination.js';
import bcrypt from 'bcryptjs';
import type { RegisterAuthDTO } from '../@types/auth/auth.dto.js';
import { UserRepository } from '../repositories/UserRepository.js';
import type { CreateUserDTO, GetUsersPaginatedDTO, UpdateMeDTO, UpdateUserDTO } from '../@types/user/dto/user.input.dto.js';
import type { UserResponseDTO } from '../@types/user/dto/user.output.dto.js';
import { buildSqlFilters } from '../builders/sql/sqlFilterBuilder.js';
import { userFilterConfig } from '../query/filters/userFilterConfig.js';
import { AppError } from '../utils/AppError.js';
import { validateRegister, validateUpdateMe, validateUser } from '../validators/user.validator.js';
import type { UserRoleRepository } from '../repositories/UserRoleRepository.js';
import pool from '../config/database.js';
import type { RoleService } from './role.Service.js';
import type { Pool } from 'mysql2/promise';

export class UserService {

  constructor(private userRepository: UserRepository, private userRoleRepository: UserRoleRepository, private roleService: RoleService, private pool: Pool) {}

  async findAllPaginated(query: GetUsersPaginatedDTO): Promise<PaginatedResponse<UserResponseDTO>> {

    const page = query.page || 1;
    const limit = query.limit || 5;
    const offset = (page - 1) * limit;

    const { where, params } = buildSqlFilters(query, userFilterConfig);

    const data = await this.userRepository.findAllPaginated({filters: {dbParams: params, where }, pagination: {limit, offset}})
    const total = await this.userRepository.count({dbParams: params, where});

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findAll(): Promise<UserResponseDTO[]>{
    return this.userRepository.findAll();
  }

  async findById(id_user: number): Promise<UserResponseDTO | null> {
    return this.userRepository.findById(id_user);
  }

  async create(dto: CreateUserDTO): Promise<number> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      validateUser(dto);
      const emailExists = await this.emailAlreadyExists(dto.email);
      if (emailExists) throw new AppError('Email já cadastrado', 409, 'EMAIL_EXISTS');

      const cleanCpf = this.cpfCleaner(dto.cpf);
      const hashedPassword = await this.generateHash(dto.password!);

      const id_user = await this.userRepository.create({ ...dto, cpf: cleanCpf, password: hashedPassword }, connection);
      await this.userRoleRepository.replaceAll(id_user, dto.id_roles, connection);

      await connection.commit();
      return id_user;
    } catch (err){
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async update(dto: UpdateUserDTO): Promise<boolean> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      validateUser(dto);
      const emailExists = await this.emailTakenByAnotherUser(dto.email, dto.id_user);
      if(emailExists) throw new AppError('Email já cadastrado', 409, 'EMAIL_EXISTS');

      const cleanCpf = this.cpfCleaner(dto.cpf);
      const hashedPassword = await this.generateHash(dto.password!);

      const result = await this.userRepository.update({ ...dto, cpf: cleanCpf, password: hashedPassword }, connection)

      const currentRolesId = await this.userRoleRepository.findRoleIdsByUser(dto.id_user, connection);
      const rolesChanged = !this.areRolesSetsEqual(currentRolesId, dto.id_roles)
      if (rolesChanged) {
        await this.roleService.syncUserRoles(dto.id_user, dto.id_roles, connection)
      }

      await connection.commit();
      return result;
    } catch (err){
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async delete(id_user: number): Promise<boolean> {
    return this.userRepository.delete(id_user);
  }

  async register(dto: RegisterAuthDTO): Promise<number>{ // registro que o cliente pode fazer
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      validateRegister(dto);
      const emailExists = await this.emailAlreadyExists(dto.email);
      if (emailExists) throw new AppError('Email já cadastrado', 409, 'EMAIL_EXISTS');

      const cleanCpf = this.cpfCleaner(dto.cpf);
      const hashedPassword = await this.generateHash(dto.password!);

      const id_user = await this.userRepository.create({ ...dto, cpf: cleanCpf, password: hashedPassword });
      await this.userRoleRepository.associateUserWithRoleById(id_user, 'customer', connection);

      await connection.commit();
      return id_user;
    } catch (err){
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async updateMe(dto: UpdateMeDTO): Promise<boolean> { // edição que o cliente pode fazer
    validateUpdateMe(dto);

    const cleanCpf = this.cpfCleaner(dto.cpf);
    const hashedPassword = await this.generateHash(dto.password!);

    return this.userRepository.updateMe({...dto, cpf: cleanCpf, password: hashedPassword});
  }

  async emailAlreadyExists(email: string): Promise<boolean>{
      return this.userRepository.emailAlreadyExists(email);
  };

  async emailTakenByAnotherUser(email: string, currentUserId: number){
      return this.userRepository.emailTakenByAnotherUser(email, currentUserId);
  }

  private areRolesSetsEqual(initialRoles: number[], newRoles: number[]): boolean {
    if (initialRoles.length !== newRoles.length) return false;
    const sortedA = [...initialRoles].sort((x, y) => x - y);
    const sortedB = [...newRoles].sort((x, y) => x - y);
    return sortedA.every((id_role, i) => id_role === sortedB[i]);
  }

  private cpfCleaner = (cpf: string): string => {
    return cpf.replace(/[.\-]/g, '');
  };

  private generateHash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 12);
  }

}
