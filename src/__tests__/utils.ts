import { readFileSync } from 'fs';

export const readFile = (filePath) => readFileSync(filePath, { encoding: 'utf-8' }).split("\n");