import {readdir, rm, access} from "fs/promises";
import path from "path";
import {prop} from "ramda";
import config from "../config";
import {Application} from "../entities/application";

export const cleanUpApplicationFiles = async (
    application: Application,
    userId: string
) => {
    const {
        document501c3 = [],
        charter = [],
        validationMaterial: {files: validationMaterialFiles = []} = {
            files: [],
        },
        organisationalStructure: {files: organisationalStructure = []} = {
            files: [],
        },
    } = application;
    const fileIds = document501c3
        .concat(charter)
        .concat(validationMaterialFiles)
        .concat(organisationalStructure)
        .map(prop("id"));
    const applicationFilesPath = path.resolve(
        config.get("APPLICATION_FILES_DIR"),
        application.id,
        `${userId}`
    );
    try {
        for await (const fileName of await readdir(applicationFilesPath)) {
            if (!fileIds.includes(fileName)) {
                await rm(path.resolve(applicationFilesPath, fileName));
            }
        }
    } catch {
        return;
    }
};
