import { cpf } from 'cpf-cnpj-validator';

type validTypes = "customer" | "admin";

export const validateCPF = (cpfUser: string): boolean => {
  return cpf.isValid(cpfUser);
};

export const cpfCleaner = (cpf: string): string => {
  return cpf.replace(/[.\-]/g, '');
};

export const isEmailValid = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return regex.test(email);
};

export const isStrongPassword = (senha: string): boolean => {
  if (senha.length < 8)  return false; // mínimo 8 caracteres
  if (senha.length > 16) return false; // máximo 16 caracteres
  if (!/[A-Z]/.test(senha)) return false; // letra maiúscula
  if (!/[a-z]/.test(senha)) return false; // letra minúscula
  if (!/\d/.test(senha))    return false; // número

  return true;
};

export const isUserTypeValid = (type: string): type is validTypes => {
  return type.includes(type as validTypes);
}