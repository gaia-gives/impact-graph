import fs from "fs";
import { getFilePath } from "./getFilePath";

export const deleteFile = (id: string): void => {
  const filePath = getFilePath(id);
  if (fs.statSync(filePath)) {
    fs.rmSync(filePath);
  } else {
    throw new Error("File not found!");
  }
};
