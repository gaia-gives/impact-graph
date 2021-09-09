import path from "path";

export function getFilePath(userId: number, id: string) {
  return path.join(__dirname, "public", "application-files", `${userId}`, id);
}
