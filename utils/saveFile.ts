import { createWriteStream, ReadStream } from "fs";
import path from "path";
import fs from "fs";
import { getFilePath } from "./getFilePath";

export function saveFile(id: string, createReadStream: () => ReadStream) {
  const filePath = getFilePath(id);
  const stream = createReadStream();
  stream.pipe(createWriteStream(filePath), {end: true});
  return filePath;
}

