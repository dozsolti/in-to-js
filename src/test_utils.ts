import { readFileSync } from 'fs';

export const readFile = (filePath: string) => readFileSync(filePath, { encoding: 'utf-8' }).split("\n");