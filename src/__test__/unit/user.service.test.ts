import { UserService } from '../../services/user.Service.js';

describe('UserService - Unitario', () => {
  const userService = UserService.getInstance();

  it('deve validar e-mails corretamente via regex', () => {
    expect(userService.isEmailValid('teste@link.com')).toBe(true);
    expect(userService.isEmailValid('email-invalido')).toBe(false);
  });

  it('deve validar força de senha (8-16 chars, Maj, Min, Num)', () => {
    expect(userService.isStrongPassword('Abc12345')).toBe(true); // Válida
    expect(userService.isStrongPassword('123')).toBe(false);      // Curta demais
    expect(userService.isStrongPassword('senhasemnumero')).toBe(false);
  });

  it('deve validar CPF corretamente', () => {
    expect(userService.validateCPF('111.111.111-11')).toBe(false); // CPF Inválido conhecido
    expect(userService.validateCPF('00000000000')).toBe(false);
    expect(userService.validateCPF('744.846.070-69')).toBe(true);
  });
});
