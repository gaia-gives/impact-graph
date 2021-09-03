import { getFilePath } from "./getFilePath";
import fs from "fs";

export function getFileSize(id: string) {
  const filePath = getFilePath(id);
  return fs.statSync(filePath).size;
}
