// models/User.ts
export class UserEntity {
    constructor(
      public name: string,
      public email: string,
      public cpf: string,
      public type: 'customer' | 'admin',
      public id_user?: number,
      public password?: string | undefined,
    ){}
}