import { ClanarineService } from './ClanarineService';
import { ClanoviService } from './ClanoviService';

export const clanarine = new ClanarineService(process.env.GOOGLE_SPREADSHEET_ID!)
export const clanovi = new ClanoviService(process.env.GOOGLE_SPREADSHEET_ID!)
