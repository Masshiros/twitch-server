// src/upload/cloudinary.provider.ts
import { ConfigService } from "@nestjs/config"
import { v2 as cloudinary } from "cloudinary"
import config from "libs/config"

export const CloudinaryProvider = {
  provide: "CLOUDINARY",
  useFactory: () => {
    return cloudinary.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,
    })
  },
  inject: [ConfigService],
}
