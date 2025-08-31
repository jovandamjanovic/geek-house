import { ClanarineService } from './ClanarineService';
import { AuthorService } from './AuthorService';
import { ClanoviService } from './ClanoviService';
import { CategoriesService } from './CategoriesService';
import { PostsService } from './PostsService';

export const clanarine = new ClanarineService(process.env.GOOGLE_SPREADSHEET_ID!)
export const clanovi = new ClanoviService(process.env.GOOGLE_SPREADSHEET_ID!)
export const autori = new AuthorService(process.env.GOOGLE_SPREADSHEET_ID!)
export const categories = new CategoriesService(process.env.GOOGLE_SPREADSHEET_ID!)
export const posts = new PostsService(process.env.GOOGLE_SPREADSHEET_ID!)
