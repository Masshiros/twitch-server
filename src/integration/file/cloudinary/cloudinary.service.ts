import { Injectable } from "@nestjs/common"
import toStream from "buffer-to-stream"
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary"

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        },
      )
      toStream(file.buffer).pipe(upload)
    })
  }
}
