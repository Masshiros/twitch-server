import { Injectable } from "@nestjs/common"
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary"

import toStream = require("buffer-to-stream")

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file || !file.buffer) {
      throw new Error("Invalid file: No buffer found in the uploaded file")
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error)
            return reject(
              new Error(`Cloudinary upload failed: ${error.message}`),
            )
          resolve(result)
        },
      )

      // Ensure `file.buffer` is a Buffer
      const buffer = Buffer.isBuffer(file.buffer)
        ? file.buffer
        : Buffer.from(file.buffer)
      toStream(buffer).pipe(upload)
    })
  }
  async deleteImage(publicId: string): Promise<{ result: string }> {
    if (!publicId) {
      throw new Error("Invalid public ID: No ID provided for deletion.")
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      })
      if (result.result !== "ok") {
        throw new Error(`Cloudinary deletion failed: ${result.result}`)
      }
      return result
    } catch (error) {
      throw new Error(`Cloudinary deletion failed: ${error.message}`)
    }
  }
}
