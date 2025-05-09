// src/services/uploadService.ts
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises'; // Use promise-based fs

// Configuration (Consider moving to a config file or env variables)
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const PUBLIC_UPLOAD_PATH = process.env.PUBLIC_UPLOAD_PATH || '/uploads';
// Assuming app runs from the root where 'uploads' dir is, or adjust relative path as needed
// This needs to point to the *actual* directory where files are saved by app.ts
const PHYSICAL_UPLOAD_DIR = path.resolve(__dirname, '..', '..', UPLOAD_DIR); // Go up twice from src/services to root

class UploadService {

    /**
     * Saves an uploaded file locally and returns its public URL.
     * @param file The UploadedFile object from req.files.
     * @param subfolder Optional subfolder within the main upload directory (e.g., 'products', 'categories').
     * @returns The publicly accessible URL of the saved file.
     */
    async saveFileLocally(file: UploadedFile, subfolder: string = ''): Promise<string> {
        if (!file) {
            throw new Error('No file provided for upload.');
        }

        try {
            // Generate a unique filename to prevent overwrites
            const fileExtension = path.extname(file.name);
            const uniqueSuffix = crypto.randomBytes(16).toString('hex');
            const uniqueFilename = `${uniqueSuffix}${fileExtension}`;

            const destinationDir = path.join(PHYSICAL_UPLOAD_DIR, subfolder);
            const destinationPath = path.join(destinationDir, uniqueFilename);

            // Ensure the subfolder exists
            await fs.mkdir(destinationDir, { recursive: true });

            // Move the file from the temporary location to the final destination
            await file.mv(destinationPath);

            // Construct the public URL
            // Important: Use forward slashes for URLs, even on Windows
            const publicUrl = `${PUBLIC_UPLOAD_PATH}/${subfolder ? subfolder + '/' : ''}${uniqueFilename}`.replace(/\\/g, '/');

            console.log(`File uploaded successfully to ${destinationPath}`);
            console.log(`Public URL: ${publicUrl}`);

            return publicUrl;

        } catch (error) {
            console.error('Error saving file:', error);
            throw new Error('Failed to save uploaded file.');
        }
    }


    async deleteFileLocal(publicUrl: string): Promise<void> {
        if (!publicUrl || !publicUrl.startsWith(PUBLIC_UPLOAD_PATH)) {
            console.warn(`Attempted to delete invalid or non-local URL: ${publicUrl}`);
            return;
        }

        try {

            const relativePath = publicUrl.substring(PUBLIC_UPLOAD_PATH.length);
            const physicalPath = path.join(PHYSICAL_UPLOAD_DIR, relativePath);


            await fs.access(physicalPath);
            await fs.unlink(physicalPath);
            console.log(`Successfully deleted file: ${physicalPath}`);

        } catch (error: any) {
            // If error is ENOENT (file not found), ignore it silently
            if (error.code !== 'ENOENT') {
                // console.error(`Error deleting file ${publicUrl} (Path: ${physicalPath}):`, error);
                // Decide if you want to throw or just log the error
                throw new Error(`Failed to delete file: ${publicUrl}`);
            } else {
                // console.warn(`File not found for deletion, possibly already deleted: ${physicalPath}`);
            }
        }
    }


    // --- Placeholder for Cloud Storage ---
    // async saveFileToCloud(file: UploadedFile, subfolder: string = ''): Promise<string> {
    //     // 1. Configure SDK for your cloud provider (e.g., aws-sdk, @google-cloud/storage)
    //     // 2. Generate unique filename
    //     // 3. Use SDK to upload file.buffer or stream to your bucket/container
    //     //    const result = await s3.upload({ Bucket: 'your-bucket', Key: `${subfolder}/${filename}`, Body: file.data }).promise();
    //     // 4. Return the public URL from the cloud provider (result.Location for S3)
    //     throw new Error('Cloud upload not implemented.');
    // }
    // async deleteFileFromCloud(publicUrl: string): Promise<void> {
    //    // 1. Parse the URL to get bucket name and object key
    //    // 2. Use SDK to delete the object
    //    //    await s3.deleteObject({ Bucket: 'your-bucket', Key: 'object-key' }).promise();
    //    throw new Error('Cloud delete not implemented.');
    // }
    // ------------------------------------
}

export default new UploadService();