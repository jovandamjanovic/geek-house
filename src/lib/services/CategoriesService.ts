import { CrudService, DataTransformers, ServiceConfig } from './base/CrudService';
import { Category, CategoryForCreation } from '@/types';

// Categories-specific data transformers
const categoryDataTransformers: DataTransformers<Category> = {
  rowToEntity: (row: string[]): Category => ({
    id: row[0] || '',
    name: row[1] || '',
    slug: row[2] || '',
    description: row[3] || undefined,
  }),

  entityToRow: (category: Category): string[] => [
    category.id,
    category.name,
    category.slug,
    category.description || '',
  ]
};

// Categories service configuration
const categoryConfig: ServiceConfig<Category> = {
  sheetConfig: {
    sheetName: 'Categories',
    range: 'Categories!A:D',
  },
  dataTransformers: categoryDataTransformers,
  idField: 'id'
};

export class CategoriesService extends CrudService<Category> {
  constructor(spreadsheetId: string, config?: ServiceConfig<Category>) {
    super(spreadsheetId, config || categoryConfig);
  }

  async getAll(): Promise<Category[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  async getById(id: string): Promise<Category | null> {
    try {
      const result = await this.findRowById(id);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw new Error(`Failed to fetch category with id ${id}`);
    }
  }

  async create(data: CategoryForCreation): Promise<Category> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const existingItems = await this.getAllRows();
        const id = this.getNextId(existingItems);
        const newCategory: Category = { ...data, id };
        
        await this.appendRow(newCategory);
        return newCategory;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Error creating category after retries:', error);
          throw new Error('Failed to create category after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error('Failed to create category');
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      const result = await this.findRowById(id);
      if (!result) return null;

      const updatedCategory = { ...result.entity, ...updates } as Category;
      await this.updateRow(result.rowIndex, updatedCategory);
      
      return updatedCategory;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw new Error(`Failed to update category with id ${id}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.findRowById(id);
      if (!result) return false;

      await this.deleteRow(result.rowIndex);
      return true;
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw new Error(`Failed to delete category with id ${id}`);
    }
  }

  // Domain-specific methods
  async getCategories(): Promise<Category[]> {
    return this.getAll();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.getById(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const categories = await this.getAllRows();
      return categories.find(category => category.slug === slug) || null;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw new Error(`Failed to fetch category with slug ${slug}`);
    }
  }

  async createCategory(category: CategoryForCreation): Promise<Category> {
    return this.create(category);
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    return this.update(id, updates);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.delete(id);
  }
}