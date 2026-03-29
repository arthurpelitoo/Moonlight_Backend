//ORDEM: dc //src/@types/index.ts
export interface IUser {
  id_usuario?: number;
  nome_usuario: string;
  email_usuario: string;
  senha_usuario: string; //back-end, trataremos o hash
  cpf_usuario: string;
  nivel_acesso: 'admin' | 'cliente';
}

export interface IProduct {
  id_produto?: number;
  nome_produto: string;
  desc_produto: string;
  preco_produto: number;
  qtd_estoque: number;
  id_categoria: number;
}
