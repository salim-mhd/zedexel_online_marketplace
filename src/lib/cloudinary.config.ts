import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { File } from "formidable";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fully typed stream upload function
export const streamUpload = (file: File): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products", resource_type: "image" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    fs.createReadStream(file.filepath).pipe(stream);
  });
};
