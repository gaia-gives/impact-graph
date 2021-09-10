import { getFilePath } from "./getFilePath";
import fs from "fs/promises";

export async function getFileSize(applicationId: string, userId: number, id: string) {
  const filePath = getFilePath(applicationId, userId, id);
  const stat =  await fs.stat(filePath)
  return stat.size;
}
