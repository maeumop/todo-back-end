import { join } from 'path';

const ROOT_PATH = process.cwd();

export const UPLOAD_PATH = join(ROOT_PATH, 'upload');
export const TEMP_PATH = join(UPLOAD_PATH, 'temp');

export const UPLOAD_URL = 'upload';
