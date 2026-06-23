import { cpf } from "cpf-cnpj-validator";
import { AppError } from "../utils/AppError.js";
import type { CreateUserDTO, UpdateMeDTO, UpdateUserDTO } from "../@types/user/dto/user.input.dto.js";
import type { LoginAuthDTO, RegisterAuthDTO } from "../@types/auth/auth.dto.js";
type validUserTypes = "customer" | "admin";

    const isCPFValid = (cpfUser: string): boolean => {
        return cpf.isValid(cpfUser);
    };

    const isEmailValid = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
        return regex.test(email);
    };

    const isStrongPassword = (senha: string): boolean => {
        if (senha.length < 8)  return false; // mínimo 8 caracteres
        if (senha.length > 16) return false; // máximo 16 caracteres
        if (!/[A-Z]/.test(senha)) return false; // letra maiúscula
        if (!/[a-z]/.test(senha)) return false; // letra minúscula
        if (!/\d/.test(senha))    return false; // número

        return true;
    };

    const isUserTypeValid = (type: string): type is validUserTypes => {
        return ['customer', 'admin'].includes(type as validUserTypes);
    }

    export const assertRequiredFields = (fields: unknown[]): void => {
        if (fields.some(field => field == null || (typeof field === 'string' && !field.trim()))) 
        throw new AppError("Todos os campos são obrigatórios", 400, "INVALID_FIELDS");
        // o ultimo caso é pra evitar de mandarem ' '.
    }

    export const assertName = (name: string): void => {
        if (name.length > 16) throw new AppError('Nome deve ter até 16 caracteres máximos', 400, "INVALID_NAME"); 
    }

    export const assertCpf = (cpf: string): void => {
        if (!isCPFValid(cpf)) throw new AppError('CPF inválido', 400, "INVALID_CPF");
    }

    export const assertEmail = (email: string): void => {
        if (!isEmailValid(email)) throw new AppError('Email inválido', 400, "INVALID_EMAIL"); 
    }

    export const assertPassword = (password: string): void => {
        if (!isStrongPassword(password)) throw new AppError('Senha deve ter pelo menos 8 a 16 caracteres, maiúscula, minúscula, número', 400, "WEAK_PASSWORD"); 
    }

    export const assertType = (type: string): void => {
        if (!isUserTypeValid(type)) throw new AppError('Tipo inválido', 400, "INVALID_TYPE"); 
    }

    export const validateUser = (dto: CreateUserDTO | UpdateUserDTO): void => {
        assertRequiredFields([dto.name, dto.email, dto.password, dto.cpf, dto.type]);
        assertName(dto.name);
        assertEmail(dto.email);
        assertCpf(dto.cpf);
        assertPassword(dto.password);
        assertType(dto.type);
    }

    export const validateRegister = (dto: RegisterAuthDTO): void => {
        assertRequiredFields([dto.name, dto.email, dto.cpf, dto.password]);
        assertName(dto.name);
        assertEmail(dto.email);
        assertPassword(dto.password);
        assertCpf(dto.cpf);
    }

    export const validateUpdateMe = (dto: UpdateMeDTO): void => {
        assertRequiredFields([dto.name, dto.cpf, dto.password]);
        assertName(dto.name);
        assertCpf(dto.cpf);
        assertPassword(dto.password);
    }

    export const validateLogin = (dto: LoginAuthDTO): void => {
        assertRequiredFields([dto.email, dto.password]);
        assertEmail(dto.email);
        assertPassword(dto.password);
    }