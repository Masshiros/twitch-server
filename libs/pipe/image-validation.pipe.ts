import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common"
import { Express } from "express"

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly maxSize: number = 5 * 1024 * 1024, // 5MB default
    private readonly allowedTypes: string[] = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ],
  ) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required")
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type ${file.mimetype}`)
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${this.maxSize / 1024 / 1024}MB`,
      )
    }

    return file
  }
}
