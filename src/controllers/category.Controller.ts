import type { NextFunction, Request, Response } from 'express';
import type { CategoryService } from '../services/category.Service.js';
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../@types/category/dto/category.input.dto.js';
import { AppError } from '../utils/AppError.js';
import { toInt } from '../utils/queryParser.js';
import { parseCategoriesQuery } from '../query/parsers/categoryParser.js';

export class CategoryController{

  constructor(private categoryService: CategoryService){} 

  getCategoriesPaginated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const categories = await this.categoryService.findAllPaginated(parseCategoriesQuery(req.query));
      if(!categories) throw new AppError("Categorias paginadas não encontradas", 404, "NOT_FOUND_CATEGORIES_PAG");

      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const categories = await this.categoryService.findAll();
      if(!categories) throw new AppError("Categorias não encontradas", 404, "NOT_FOUND_CATEGORIES");

      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };

  // busca os jogos pelo seu id
  getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = toInt(req.params.id, 0);
      if (!categoryId) throw new AppError("ID inválido", 400, "INVALID_ID");

      const category = await this.categoryService.findById(categoryId);
      if (!category) throw new AppError("Categoria não encontrada", 404, "NOT_FOUND_CATEGORY");
      
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  // Cria os jogos pelo comando do (admin) 
  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateCategoryDTO;

      await this.categoryService.create(dto);

      res.status(201).json({ message: 'Categoria criada com sucesso!' });
    } catch (error) {
      next(error);
    }
  };

  // atyaliza o jogo pelos comandos de um (Admin)
  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as UpdateCategoryDTO;
      
      const id_category = toInt(req.params.id, 0);
      if (!id_category) throw new AppError("ID inválido", 400, "INVALID_ID");

      const category = await this.categoryService.update({...dto, id_category});
      if(!category) throw new AppError("Categoria não encontrada", 404, "NOT_FOUND_CATEGORY");

      res.status(200).json({ message: 'Categoria atualizada com sucesso!' });
    } catch (error) {
      next(error)
    }
  };

  // Deleta o jogo pelos comandos de (admin) 
  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id_category = toInt(req.params.id, 0);
      if (!id_category) throw new AppError("ID inválido", 400, "INVALID_ID");

      const category = await this.categoryService.delete(id_category);
      if(!category) throw new AppError("Categoria não encontrada", 404, "NOT_FOUND_CATEGORY");

      res.status(200).json({ message: 'Categoria deletada com sucesso!' });
    } catch (error) {
      next(error);
    }
  };
}
