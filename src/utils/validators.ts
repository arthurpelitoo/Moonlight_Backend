import { cpf } from 'cpf-cnpj-validator';
import 

export const validarCpf = (cpfUsuario: string): boolean => {
  const cpfLimpo = cpfUsuario.replace(/[.\-]/g, '');
  return cpf.isValid(cpfLimpo);
};