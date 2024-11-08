import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ESharedType } from "src/module/posts/domain/enum/shared-type.enum"

export class SharePostToMeRequestDto {
  @ApiProperty({
    description: "The unique identifier of post",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  postId: string
  @ApiProperty({
    description: "Share to type(user/group/chat)",
    enum: ESharedType,
    required: false,
  })
  @IsEnum(ESharedType)
  @IsOptional()
  shareToType: ESharedType
  @ApiProperty({
    description: "Content when user share ",
    example: "Like this post please",
    type: String,
  })
  customContent?: string
}
