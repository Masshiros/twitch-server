import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { EImageType } from "../enum/image-type.enum"
import { EImage } from "../enum/image.enum"

interface ImageProps {
  id?: string
  url: string // Cloudinary URL
  publicId: string // Cloudinary public_id for deletion
  applicableId: string
  applicableType: EImage
  imageType: EImageType
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class Image extends BaseEntity {
  private _url: string // Cloudinary URL
  private _publicId: string // Cloudinary public_id for deletion
  private _applicableId: string
  private _applicableType: EImage
  private _imageType: EImageType
  constructor(props: ImageProps) {
    super()
    this._id = props.id || randomUUID()
    this._url = props.url
    this._publicId = props.publicId
    this._applicableId = props.applicableId
    this._applicableType = props.applicableType
    this._imageType = props.imageType
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }
  get id(): string {
    return this._id
  }

  get url(): string {
    return this._url
  }

  get publicId(): string {
    return this._publicId
  }

  get applicableId(): string {
    return this._applicableId
  }

  get applicableType(): EImage {
    return this._applicableType
  }
  get imageType(): EImageType {
    return this._imageType
  }
  set imageType(value: EImageType) {
    this._imageType = value
  }
  set url(value: string) {
    this._url = value
  }

  set publicId(value: string) {
    this._publicId = value
  }

  set applicableId(value: string) {
    this._applicableId = value
  }

  set applicableType(value: EImage) {
    this._applicableType = value
  }
}
