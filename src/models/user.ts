// models/User.ts
export class UserEntity {
  constructor(
    public id_user: number,
    public name: string,
    public email: string,
    public cpf: string,
    public type: 'customer' | 'admin',
    public password?: string,
  ) {}
}