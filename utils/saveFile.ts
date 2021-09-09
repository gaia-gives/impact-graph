import { createWriteStream, ReadStream } from "fs";
import path from "path";
import fs from "fs/promises";
import { getFilePath } from "./getFilePath";

export async function saveFile(userId: number, id: string, createReadStream: () => ReadStream) {
  const filePath = getFilePath(userId, id);
  await fs.mkdir(path.resolve(filePath, ".."), { recursive: true });
  const stream = createReadStream();
  const writeStream = stream.pipe(createWriteStream(filePath), { end: true });

  return new Promise((resolve) => {
    writeStream.on("close", () => resolve(filePath));
  });
}
