import { getFilePath } from "./getFilePath";
import fs from "fs/promises";

export async function getFileSize(userId: number, id: string) {
  const filePath = getFilePath(userId, id);
  console.log({filePath});
  const stat =  await fs.stat(filePath)
  return stat.size;
}
