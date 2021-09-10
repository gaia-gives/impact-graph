import path from "path";
import config from "../config";

export function getFilePath(applicationId: string, userId: number, id: string) {
  return path.join(config.get("APPLICATION_FILES_DIR"), `${applicationId}`, `${userId}`, id);
}
