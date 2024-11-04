import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common"
import sharp from "sharp" // sharp helps in image manipulation and analysis

interface FileValidationOptions {
  allowedTypes?: string[]
  maxSize?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  aspectRatio?: number // Aspect ratio as width/height, e.g., 16/9 for 16:9
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {}

  async transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) {
      throw new BadRequestException("File is required!")
    }

    const {
      allowedTypes = [],
      maxSize = 1024 * 1024 * 5, // Default to 5MB
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      aspectRatio,
    } = this.options

    // Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
      )
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB`,
      )
    }

    // Further checks if the file is an image (optional)
    if (file.mimetype.startsWith("image/")) {
      const { width, height } = await sharp(Buffer.from(file.buffer)).metadata()

      // Check image dimensions
      if (minWidth && width < minWidth) {
        throw new BadRequestException(
          `Image width must be at least ${minWidth}px`,
        )
      }
      if (minHeight && height < minHeight) {
        throw new BadRequestException(
          `Image height must be at least ${minHeight}px`,
        )
      }
      if (maxWidth && width > maxWidth) {
        throw new BadRequestException(
          `Image width must not exceed ${maxWidth}px`,
        )
      }
      if (maxHeight && height > maxHeight) {
        throw new BadRequestException(
          `Image height must not exceed ${maxHeight}px`,
        )
      }

      // Validate aspect ratio
      if (aspectRatio && width / height !== aspectRatio) {
        throw new BadRequestException(
          `Image aspect ratio must be ${aspectRatio}`,
        )
      }
    }

    return file
  }
}
