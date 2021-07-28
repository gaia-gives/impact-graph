import { createWriteStream } from "fs";
import path from "path";
import fs from "fs";

export async function saveFile(id: string, createReadStream: any, fileName: string) {
  const applicationDirectory = path.join(
    __dirname,
    "public",
    "applications",
    id
  );

  if (directoryDoesNotExist(applicationDirectory)) {
    createDirectory(applicationDirectory);
  }

  var uploadPath = path.join(applicationDirectory, fileName);

  const stream = createReadStream();
  await stream.pipe(createWriteStream(uploadPath));
  return uploadPath;
}

function directoryDoesNotExist(path: string) {
  return !fs.existsSync(path);
}

function createDirectory(path: string) {
  fs.mkdirSync(path, { recursive: true });
}
