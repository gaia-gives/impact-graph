import fs from "fs";
import { getFilePath } from "./getFilePath";

export const deleteFile = (applicationId: string, userId: number, id: string): void => {
  const filePath = getFilePath(applicationId, userId, id);
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
};
