import { CrudService, DataTransformers, ServiceConfig } from './base/CrudService';
import { Author, AuthorForCreation } from '@/types';

// Authors-specific data transformers
const authorDataTransformers: DataTransformers<Author> = {
  rowToEntity: (row: string[]): Author => ({
    id: row[0] || '',
    ime: row[1] || '',
    email: row[2] || '',
    bio: row[3] || '',
    avatar_url: row[4] || '',
  }),

  entityToRow: (author: Author): string[] => [
    author.id,
    author.ime,
    author.email || '',
    author.bio || '',
    author.avatar_url || '',
  ]
};

// Authors service configuration
const authorConfig: ServiceConfig<Author> = {
  sheetConfig: {
    sheetName: 'Authors',
    range: 'Authors!A2:E',
  },
  dataTransformers: authorDataTransformers,
  idField: 'id'
};

export class AuthorService extends CrudService<Author> {
  constructor(spreadsheetId: string, config?: ServiceConfig<Author>) {
    super(spreadsheetId, config || authorConfig);
  }

  async getAll(): Promise<Author[]> {
    try {
      return await this.getAllRows();
    } catch (error) {
      console.error('Error fetching authors:', error);
      throw new Error('Failed to fetch authors');
    }
  }

  async getById(id: string): Promise<Author | null> {
    try {
      const result = await this.findRowById(id);
      return result ? result.entity : null;
    } catch (error) {
      console.error(`Error fetching author with id ${id}:`, error);
      throw new Error(`Failed to fetch author with id ${id}`);
    }
  }

  async create(data: AuthorForCreation): Promise<Author> {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const existingItems = await this.getAllRows();
        const id = this.getNextId(existingItems);
        const newAuthor: Author = { ...data, id };
        
        await this.appendRow(newAuthor);
        return newAuthor;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Error creating author after retries:', error);
          throw new Error('Failed to create author after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error('Failed to create author');
  }

  async update(id: string, updates: Partial<Author>): Promise<Author | null> {
    try {
      const result = await this.findRowById(id);
      if (!result) return null;

      const updatedAuthor = { ...result.entity, ...updates } as Author;
      await this.updateRow(result.rowIndex, updatedAuthor);
      
      return updatedAuthor;
    } catch (error) {
      console.error(`Error updating author with id ${id}:`, error);
      throw new Error(`Failed to update author with id ${id}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.findRowById(id);
      if (!result) return false;

      await this.deleteRow(result.rowIndex);
      return true;
    } catch (error) {
      console.error(`Error deleting author with id ${id}:`, error);
      throw new Error(`Failed to delete author with id ${id}`);
    }
  }

  // Domain-specific methods
  async getAuthors(): Promise<Author[]> {
    return this.getAll();
  }

  async getAuthorById(id: string): Promise<Author | null> {
    return this.getById(id);
  }

  async createAuthor(author: AuthorForCreation): Promise<Author> {
    return this.create(author);
  }

  async updateAuthor(id: string, updates: Partial<Author>): Promise<Author | null> {
    return this.update(id, updates);
  }

  async deleteAuthor(id: string): Promise<boolean> {
    return this.delete(id);
  }
}