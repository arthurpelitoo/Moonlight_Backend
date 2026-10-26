import type { PoolConnection } from "mysql2/promise";
import type { RoleResponseDTO } from "../@types/role/role.dto.js";
import pool from "../config/database.js";
import type { RoleRepository } from "../repositories/RoleRepository.js";
import type { UserRepository } from "../repositories/UserRepository.js";
import type { UserRoleRepository } from "../repositories/UserRoleRepository.js";

export class RoleService{

  constructor(private roleRepository: RoleRepository, private userRoleRepository: UserRoleRepository, private userRepository: UserRepository) { };

  async findAll(): Promise<RoleResponseDTO[]>{
    return await this.roleRepository.findAll();
  }

  async syncUserRoles(id_user: number, id_roles: number[], externalConnection?: PoolConnection): Promise<void>{
    const connection = externalConnection ?? await pool.getConnection();
    const shouldManageTransaction = !externalConnection; // só controla commit/rollback se abriu a conexão
    if (shouldManageTransaction) await connection.beginTransaction();
    try {
      await this.userRoleRepository.replaceAll(id_user, id_roles, connection);
      await this.userRepository.incrementRoleVersion(id_user, connection);
      if (shouldManageTransaction) await connection.commit();
    } catch (err){
      if (shouldManageTransaction) await connection.rollback();
      throw err;
    } finally {
      if (shouldManageTransaction) connection.release();
    }
  }
}
