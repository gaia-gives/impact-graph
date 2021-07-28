import fs from "fs/promises";

export const deleteFile = async (path: string): Promise<void> => {
    if (fs.stat(path)) {
        return await fs.rm(path);
    } else {
        throw new Error('File not found!');
    }
}