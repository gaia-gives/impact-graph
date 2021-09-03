import path from "path";

export function getFilePath(id) {
  return path.join(__dirname, "public", "application-files", id);
}
