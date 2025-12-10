import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";

const publicKey = process.env.ILOVEPDF_PUBLIC_KEY!;
const secretKey = process.env.ILOVEPDF_SECRET_KEY!;

if (!publicKey || !secretKey) {
    throw new Error("Missing iLovePDF API keys");
}

const ilovepdf = new ILovePDFApi(publicKey, secretKey);

import fs from "fs/promises";
import path from "path";
import os from "os";

// ... (existing imports)

export const processFile = async (
    tool: string,
    buffer: Buffer,
    filename: string,
    params?: any
): Promise<Buffer> => {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `documind_${Date.now()}_${filename}`);

    try {
        await fs.writeFile(tempFilePath, buffer);

        const task = ilovepdf.newTask(tool as any);
        await task.start();

        const file = new ILovePDFFile(tempFilePath);
        await task.addFile(file);

        if (params) {
            await task.process(params);
        } else {
            await task.process();
        }

        const data = await task.download();
        return Buffer.from(data);
    } finally {
        await fs.unlink(tempFilePath).catch(() => { });
    }
};

export default ilovepdf;
