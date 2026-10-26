import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthResponseDTO, LoginAuthDTO } from "../@types/auth/auth.dto.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { AppError } from "../utils/AppError.js";
import { validateLogin } from "../validators/user.validator.js";
import type { UserRoleRepository } from "../repositories/UserRoleRepository.js";

export class AuthService {
  constructor(private userRepository: UserRepository, private userRoleRepository: UserRoleRepository) {}

  async login(dto: LoginAuthDTO): Promise<AuthResponseDTO> {
    validateLogin(dto);

    const user = await this.findByEmail(dto.email);
    if (!user) throw new AppError("Email ou senha inválidos", 401, "INVALID_FIELDS");

    const passwordMatch = await this.verifyPassword(dto.password, user.password!);
    if (!passwordMatch) throw new AppError("Email ou senha inválidos", 401, "INVALID_FIELDS");

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError("JWT_SECRET não configurado", 500, "NOT_CONFIGURED_SECRET");

    user.roles = await this.findUserRoleNamesByUser(user.id_user);

    user.token = this.generateToken(secret, user);

    return user;
  }

  async findByEmail(email: string): Promise<AuthResponseDTO | null> {
    return this.userRepository.findByEmail(email);
  }

  async findUserRoleNamesByUser(id_user: number): Promise<string[]>{
    return await this.userRoleRepository.findUserRoleNamesByUser(id_user);
  }

  async verifyPassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }

  generateToken(secret: string | undefined, user: AuthResponseDTO): string {
    return jwt.sign({ id_user: user.id_user, roles: user.roles, role_version: user.role_version }, secret!, {
      expiresIn: "8h",
    });
  }
}
