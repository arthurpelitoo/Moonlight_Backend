import type { Request, Response } from 'express';
import pool from '../config/database.js';
import type { CategoryDTO, CategoryPaginatedQueryPayload, CategoryQueryPayload } from '../@types/index.js';
import type { ResultSetHeader } from 'mysql2';
import type { CategoryService } from '../services/category.Service.js';

export class CategoryController{

  constructor(private categoryService: CategoryService){} 

  getCategoriesPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
      const buildQuery = (): CategoryPaginatedQueryPayload => ({
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 8,
          random: req.query.random === 'true',
          name: req.query.name as string || undefined
      })
      
      const result = await this.categoryService.findAllPaginated(buildQuery());
      if(!result) return res.status(404).json({ message: 'Categorias paginadas não encontradas' });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar categorias paginadas', error });
    }
  };

  getCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
      
      const result = await this.categoryService.findAll();
      if(!result) return res.status(404).json({ message: 'Categorias não encontradas' });

      return res.status(200).json(result as CategoryDTO[]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar categorias', error });
    }
  };

  // busca os jogos pelo seu id
  getCategoryById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const categoryId = parseInt(req.params.id ?? '0');
      if (!categoryId) return res.status(400).json({ message: 'ID inválido' });

      const data = await this.categoryService.findById(categoryId);
      if (!data) return res.status(404).json({ message: 'Categoria não encontrada' });
      
      return res.status(200).json(data as CategoryDTO);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar categoria', error });
    }
  };

  // Cria os jogos pelo comando do (admin) 
  createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, description, image } = req.body;

      if (!name || !description) return res.status(400).json({ message: 'nome e descrição são obrigatórios' });

      const buildQuery = (): CategoryQueryPayload => ({name, description, image})
      const newCategoryId = await this.categoryService.create(buildQuery());

      return res.status(201).json({ message: 'Categoria criada com sucesso!', id_category: newCategoryId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar categoria', error });
    }
  };

  // atyaliza o jogo pelos comandos de um (Admin)
  updateCategory = async (req: Request, res: Response): Promise<Response> => {
    try {

      const { id } = req.params;
      const id_category = parseInt(id as string);
      const { name, description, image } = req.body;

      if (!name || !description) return res.status(400).json({ message: 'nome e descrição são obrigatórios' });

      const buildQuery = (): CategoryQueryPayload => ({name, description, image})

      const result = await this.categoryService.update(buildQuery(), id_category);
      if(!result) return res.status(404).json({ message: 'Categoria não encontrada' });

      return res.status(200).json({ message: 'Categoria atualizada com sucesso!' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar categoria', error });
    }
  };

  // Deleta o jogo pelos comandos de (admin) 
  deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const id_category = parseInt(id as string);

      const result = await this.categoryService.delete(id_category);
      if(!result) return res.status(404).json({ message: 'Categoria não encontrada' });

      return res.status(200).json({ message: 'Categoria deletada com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar categoria', error });
    }
  };
}
