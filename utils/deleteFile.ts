import fs from "fs";
import { getFilePath } from "./getFilePath";

export const deleteFile = (userId: number, id: string): void => {
  const filePath = getFilePath(userId, id);
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
};
